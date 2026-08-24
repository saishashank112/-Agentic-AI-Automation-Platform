const plannerAgent = require('./plannerAgent');
const executionAgent = require('./executionAgent');
const validationAgent = require('./validationAgent');
const recoveryAgent = require('./recoveryAgent');
const monitoringAgent = require('./monitoringAgent');
const autoHealingAgent = require('./autoHealingAgent');
const approvalAgent = require('./approvalAgent');
const rootCauseAgent = require('./rootCauseAgent');
const RootCauseAnalysis = require('../models/RootCauseAnalysis');
const HealingOperation = require('../models/HealingOperation');
const healingAgent = require('./healingAgent');
const Execution = require('../models/Execution');
const AgentMemory = require('../models/AgentMemory');
const notificationService = require('../services/notificationService');
const mongoose = require('mongoose');
const memDb = require('../config/memDb');

let isLangGraphAvailable = false;
try {
  require('@langchain/langgraph');
  isLangGraphAvailable = true;
} catch (e) {
  isLangGraphAvailable = false;
}

class Orchestrator {
  async runExecution(executionId, userId) {
    let execution;
    if (mongoose.connection.readyState === 1) {
      execution = await Execution.findById(executionId).populate('workflowId');
    } else {
      execution = await memDb.findExecutionById(executionId);
    }
    if (!execution) throw new Error('Execution record not found');

    const workflow = execution.workflowSnapshot || execution.workflowId;
    const langGraphStatus = isLangGraphAvailable ? 'available' : 'not-installed';

    execution.status = 'RUNNING';
    execution.startTime = execution.startTime || new Date();
    execution.langGraphStatus = langGraphStatus;

    if (mongoose.connection.readyState === 1) {
      await execution.save();
    } else {
      await memDb.updateExecution(execution._id, { status: 'RUNNING', startTime: execution.startTime, langGraphStatus });
    }

    await monitoringAgent.logEvent(
      execution._id,
      execution.workflowId._id || execution.workflowId,
      'monitoring',
      'info',
      `Execution started. LangGraph Substrate: ${langGraphStatus}`,
      { langGraphStatus }
    );

    let promptTokensSum = 0;
    let completionTokensSum = 0;

    try {
      // 1. Planner Agent Step
      await monitoringAgent.logEvent(
        execution._id,
        execution.workflowId._id || execution.workflowId,
        'planner',
        'info',
        'Planner Agent calculating topological node execution order...'
      );

      const planResult = await plannerAgent.plan(workflow);
      const { executionPlan, confidenceScore } = planResult;

      promptTokensSum += 120;
      completionTokensSum += 65;

      await monitoringAgent.logEvent(
        execution._id,
        execution.workflowId._id || execution.workflowId,
        'planner',
        'success',
        `Planner Agent generated plan with ${executionPlan.length} nodes (Confidence: ${(confidenceScore * 100).toFixed(0)}%)`,
        { confidenceScore, planSummary: planResult.planSummary }
      );

      let accumulatedOutputs = execution.outputs || {};

      // 2. Loop through planned nodes
      for (const node of executionPlan) {
        // Skip already completed nodes if re-running after pause/healing
        if (accumulatedOutputs[node.id]) {
          continue;
        }

        let currentCheck;
        if (mongoose.connection.readyState === 1) {
          currentCheck = await Execution.findById(execution._id);
        } else {
          currentCheck = await memDb.findExecutionById(execution._id);
        }

        if (currentCheck?.status === 'PAUSED') {
          await monitoringAgent.logEvent(
            execution._id,
            execution.workflowId._id || execution.workflowId,
            'monitoring',
            'warning',
            `Execution paused by operator at node: ${node.data?.label || node.id}`,
            {},
            node.id
          );
          return;
        }
        if (currentCheck?.status === 'CANCELLED') {
          await monitoringAgent.logEvent(
            execution._id,
            execution.workflowId._id || execution.workflowId,
            'monitoring',
            'error',
            `Execution cancelled by operator. Terminating run.`,
            {},
            node.id
          );
          return;
        }

        // 2a. Pre-Execution Policy & Human-in-the-Loop Governance Check
        const nodeConfidence = node.data?.confidence || 0.95;
        const approvalCheck = await approvalAgent.evaluateApprovalRequired(
          execution,
          node,
          nodeConfidence,
          node.type === 'google-sheets' ? 'FINANCIAL_THRESHOLD' : 'HIGH_RISK_ACTION',
          `Automated safety policy triggered for step "${node.data?.label || node.id}".`
        );

        if (approvalCheck.required) {
          execution.status = 'PAUSED';
          if (mongoose.connection.readyState === 1) {
            await execution.save();
          } else {
            await memDb.updateExecution(execution._id, { status: 'PAUSED' });
          }

          await monitoringAgent.logEvent(
            execution._id,
            execution.workflowId._id || execution.workflowId,
            'monitoring',
            'warning',
            `🛡️ Control Tower: Execution paused. Human approval requested for "${node.data?.label || node.id}" (Reason: ${approvalCheck.approvalRequest?.reason || 'POLICY_THRESHOLD'}).`,
            { approvalRequestId: approvalCheck.approvalRequest?._id },
            node.id
          );

          await notificationService.createNotification(
            userId,
            'Action Approval Required',
            `Workflow "${workflow.name || 'Automation'}" paused at step "${node.data?.label || node.id}". Operator approval is required.`,
            'warning',
            execution.workflowId._id || execution.workflowId,
            execution._id
          );

          return; // Pause execution until approved in Control Tower
        }

        execution.currentNode = node.id;
        if (mongoose.connection.readyState === 1) {
          await execution.save();
        } else {
          await memDb.updateExecution(execution._id, { currentNode: node.id });
        }

        await monitoringAgent.logEvent(
          execution._id,
          execution.workflowId._id || execution.workflowId,
          'execution',
          'info',
          `Execution Agent starting node: "${node.data?.label || node.id}" (${node.type})`,
          { node },
          node.id
        );

        let attempt = 0;
        let success = false;
        let activeNode = node;

        while (!success && attempt < 3) {
          try {
            const execResult = await executionAgent.executeNode(activeNode, accumulatedOutputs, userId);

            promptTokensSum += 150;
            completionTokensSum += 90;

            // 3. Validation Agent Step
            await monitoringAgent.logEvent(
              execution._id,
              execution.workflowId._id || execution.workflowId,
              'validation',
              'info',
              `Validation Agent verifying outputs for node: ${activeNode.data?.label || activeNode.id}`,
              { result: execResult },
              activeNode.id
            );

            const valResult = await validationAgent.validate(activeNode, execResult);

            if (valResult.valid) {
              success = true;
              accumulatedOutputs[activeNode.id] = execResult.output;

              await monitoringAgent.logEvent(
                execution._id,
                execution.workflowId._id || execution.workflowId,
                'validation',
                'success',
                `Validation Agent passed output schema for node: ${activeNode.data?.label || activeNode.id}`,
                { output: execResult.output },
                activeNode.id
              );
            } else {
              // 4. Auto-Healing & Recovery Agent Step
              await monitoringAgent.logEvent(
                execution._id,
                execution.workflowId._id || execution.workflowId,
                'recovery',
                'warning',
                `Validation failed (${valResult.errorType}): ${valResult.reason}. Invoking Autonomous Self-Healing Agent.`,
                { errorType: valResult.errorType },
                activeNode.id
              );

              const healResult = await autoHealingAgent.healNode(
                execution._id,
                execution.workflowId._id || execution.workflowId,
                activeNode,
                valResult.reason,
                attempt
              );

              if (healResult.repaired) {
                activeNode = healResult.patchedNode;
                attempt++;
                continue;
              }

              const recoveryDecision = await recoveryAgent.handleFailure(valResult.errorType, attempt);

              if (recoveryDecision.decision === 'retry_with_backoff') {
                attempt = recoveryDecision.nextRetryCount;
                execution.retryCount = (execution.retryCount || 0) + 1;

                await monitoringAgent.logEvent(
                  execution._id,
                  execution.workflowId._id || execution.workflowId,
                  'recovery',
                  'warning',
                  recoveryDecision.message,
                  { backoffMs: recoveryDecision.backoffMs },
                  activeNode.id
                );

                await new Promise((resolve) => setTimeout(resolve, Math.min(recoveryDecision.backoffMs, 2000)));
              } else {
                throw new Error(recoveryDecision.message);
              }
            }
          } catch (nodeErr) {
            if (attempt >= 2) throw nodeErr;
            attempt++;
          }
        }
      }

      // Compute Total Tokens & Estimated Cost
      const totalTokens = promptTokensSum + completionTokensSum;
      const estimatedCost = (promptTokensSum * 0.0000015 + completionTokensSum * 0.000002).toFixed(6);

      execution.status = 'COMPLETED';
      execution.endTime = new Date();
      execution.duration = execution.endTime - execution.startTime;
      execution.outputs = accumulatedOutputs;
      execution.tokenUsage = { promptTokens: promptTokensSum, completionTokens: completionTokensSum, totalTokens };
      execution.estimatedCost = `$${estimatedCost}`;

      if (mongoose.connection.readyState === 1) {
        await execution.save();
      } else {
        await memDb.updateExecution(execution._id, {
          status: 'COMPLETED',
          endTime: execution.endTime,
          duration: execution.duration,
          outputs: accumulatedOutputs,
          tokenUsage: execution.tokenUsage,
          estimatedCost: execution.estimatedCost,
        });
      }

      await monitoringAgent.logEvent(
        execution._id,
        execution.workflowId._id || execution.workflowId,
        'monitoring',
        'success',
        `Workflow Execution completed successfully in ${execution.duration}ms. Tokens: ${totalTokens} | Cost: $${estimatedCost}`,
        { outputs: accumulatedOutputs, tokenUsage: execution.tokenUsage, estimatedCost: execution.estimatedCost }
      );

      await notificationService.createNotification(
        userId,
        'Workflow Execution Completed',
        `Workflow "${workflow.name || 'Automation'}" finished execution successfully. Cost: $${estimatedCost}`,
        'success',
        execution.workflowId._id || execution.workflowId,
        execution._id
      );
    } catch (err) {
      execution.status = 'FAILED';
      execution.endTime = new Date();
      execution.duration = execution.endTime - execution.startTime;
      execution.error = { message: err.message, stack: err.stack };

      if (mongoose.connection.readyState === 1) {
        await execution.save();
      } else {
        await memDb.updateExecution(execution._id, {
          status: 'FAILED',
          endTime: execution.endTime,
          duration: execution.duration,
          error: execution.error,
        });
      }

      // Automatically trigger Root Cause Analysis and Healing Proposal
      const failedNode = (workflow.nodes || []).find((n) => n.id === execution.currentNode) || { id: 'failed_node', data: { label: 'Failed Step' } };
      try {
        const rcaData = await rootCauseAgent.analyzeFailure(execution, failedNode, err.message);
        let rcaDoc;
        if (mongoose.connection.readyState === 1) {
          rcaDoc = await RootCauseAnalysis.create(rcaData);
        } else {
          rcaDoc = await memDb.createRootCauseAnalysis(rcaData);
        }

        const healingProposal = await healingAgent.proposeHealing(execution, failedNode, rcaDoc);
        if (mongoose.connection.readyState === 1) {
          await HealingOperation.create(healingProposal);
        } else {
          await memDb.createHealingOperation(healingProposal);
        }

        await monitoringAgent.logEvent(
          execution._id,
          execution.workflowId._id || execution.workflowId,
          'recovery',
          'warning',
          `🔍 Root Cause Diagnosis Generated: ${rcaData.rootCause} - ${rcaData.explanation}. Healing plan prepared in Control Tower.`,
          { rca: rcaData, healingProposal }
        );
      } catch (rcaErr) {
        console.error('RCA/Healing generation error:', rcaErr.message);
      }

      await monitoringAgent.logEvent(
        execution._id,
        execution.workflowId._id || execution.workflowId,
        'monitoring',
        'error',
        `Workflow Execution FAILED: ${err.message}`,
        { error: err.message }
      );

      await notificationService.createNotification(
        userId,
        'Workflow Execution Failed',
        `Workflow execution failed: ${err.message}. Root cause diagnosis available in Control Tower.`,
        'error',
        execution.workflowId._id || execution.workflowId,
        execution._id
      );
    }
  }
}

module.exports = new Orchestrator();
