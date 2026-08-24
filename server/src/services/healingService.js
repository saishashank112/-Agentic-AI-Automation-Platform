const mongoose = require('mongoose');
const RootCauseAnalysis = require('../models/RootCauseAnalysis');
const HealingOperation = require('../models/HealingOperation');
const executionService = require('./executionService');
const rootCauseAgent = require('../agents/rootCauseAgent');
const healingAgent = require('../agents/healingAgent');
const orchestrator = require('../agents/orchestrator');
const memDb = require('../config/memDb');

const analyzeExecutionFailure = async (executionId, userId) => {
  const execution = await executionService.getExecutionById(executionId, userId);
  const logs = await executionService.getExecutionTimelineLogs(executionId);

  const failedLog = logs.find((l) => l.level === 'error') || logs[logs.length - 1];
  const failedNode = (execution.workflowSnapshot?.nodes || []).find((n) => n.id === execution.currentNode) || { id: 'failed_node', data: { label: 'Failed Step' } };

  const rcaData = await rootCauseAgent.analyzeFailure(execution, failedNode, execution.error || failedLog?.message);

  let rcaDoc;
  if (mongoose.connection.readyState === 1) {
    rcaDoc = await RootCauseAnalysis.create(rcaData);
  } else {
    rcaDoc = await memDb.createRootCauseAnalysis(rcaData);
  }

  // Generate proposed HealingOperation
  const healingProposal = await healingAgent.proposeHealing(execution, failedNode, rcaDoc);
  let healingDoc;
  if (mongoose.connection.readyState === 1) {
    healingDoc = await HealingOperation.create(healingProposal);
  } else {
    healingDoc = await memDb.createHealingOperation(healingProposal);
  }

  return { rootCause: rcaDoc, healingProposal: healingDoc };
};

const getRootCauseByExecution = async (executionId) => {
  if (mongoose.connection.readyState === 1) {
    return await RootCauseAnalysis.findOne({ executionId });
  } else {
    return await memDb.findRootCauseByExecution(executionId);
  }
};

const getHealingByExecution = async (executionId) => {
  if (mongoose.connection.readyState === 1) {
    return await HealingOperation.find({ executionId });
  } else {
    return await memDb.findHealingOperationsByExecution(executionId);
  }
};

const approveHealing = async (healingId, userId) => {
  let doc;
  if (mongoose.connection.readyState === 1) {
    doc = await HealingOperation.findByIdAndUpdate(healingId, { status: 'APPLIED', approvedBy: userId, completedAt: new Date() }, { new: true });
  } else {
    doc = await memDb.updateHealingOperation(healingId, { status: 'APPLIED', approvedBy: userId, completedAt: new Date() });
  }

  // Trigger Partial Re-execution
  if (doc) {
    setImmediate(async () => {
      try {
        await orchestrator.runExecution(doc.executionId.toString(), userId.toString());
      } catch (err) {
        console.error('Re-execution error:', err.message);
      }
    });
  }

  return doc;
};

const rejectHealing = async (healingId, userId) => {
  if (mongoose.connection.readyState === 1) {
    return await HealingOperation.findByIdAndUpdate(healingId, { status: 'REJECTED', approvedBy: userId }, { new: true });
  } else {
    return await memDb.updateHealingOperation(healingId, { status: 'REJECTED', approvedBy: userId });
  }
};

module.exports = {
  analyzeExecutionFailure,
  getRootCauseByExecution,
  getHealingByExecution,
  approveHealing,
  rejectHealing,
};
