const mongoose = require('mongoose');
const ApprovalRequest = require('../models/ApprovalRequest');
const Policy = require('../models/Policy');
const memDb = require('../config/memDb');

class ApprovalAgent {
  async evaluateApprovalRequired(execution, node, confidence, actionType = 'HIGH_RISK_ACTION', description = '') {
    // 1. Check confidence threshold
    let requiresApproval = false;
    let reason = actionType;

    if (confidence < 0.90) {
      requiresApproval = true;
      reason = confidence < 0.70 ? 'LOW_AI_CONFIDENCE' : 'SELF_HEAL_LOW_CONFIDENCE';
    }

    // 2. Check node input for financial or sensitive values
    const inputVal = node.data?.amount || node.data?.value || 0;
    if (inputVal > 500000 || node.type === 'google-sheets') {
      requiresApproval = true;
      reason = 'FINANCIAL_THRESHOLD';
    }

    // 3. Evaluate Policy Engine
    let userPolicies = [];
    if (mongoose.connection.readyState === 1) {
      userPolicies = await Policy.find({ owner: execution.workflowId.owner || execution.owner, enabled: true });
    } else {
      userPolicies = await memDb.findPoliciesByUser(execution.workflowId.owner || execution.owner);
    }

    for (const pol of userPolicies) {
      if (pol.conditions?.operator === '>' && inputVal > pol.conditions?.value) {
        requiresApproval = true;
        reason = 'POLICY_VIOLATION';
        description += ` [Triggered Policy: ${pol.name}]`;
      }
    }

    if (requiresApproval) {
      const payload = {
        executionId: execution._id || execution.id,
        workflowId: execution.workflowId._id || execution.workflowId,
        nodeId: node.id,
        reason,
        riskLevel: confidence < 0.70 ? 'CRITICAL' : 'HIGH',
        confidence,
        description: description || `Approval required for action on node "${node.data?.label || node.id}". Confidence: ${(confidence * 100).toFixed(0)}%.`,
        proposedAction: `Execute node "${node.data?.label || node.id}" with payload verification.`,
        inputSnapshot: node.data || {},
        reasoningSummary: `AI confidence (${(confidence * 100).toFixed(0)}%) or policy threshold triggered safety governance rule.`,
        status: 'PENDING',
      };

      let reqDoc;
      if (mongoose.connection.readyState === 1) {
        reqDoc = await ApprovalRequest.create(payload);
      } else {
        reqDoc = await memDb.createApprovalRequest(payload);
      }
      return { required: true, approvalRequest: reqDoc };
    }

    return { required: false };
  }
}

module.exports = new ApprovalAgent();
