const mongoose = require('mongoose');

const approvalRequestSchema = new mongoose.Schema(
  {
    executionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Execution',
      required: true,
    },
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
    },
    nodeId: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      enum: [
        'LOW_AI_CONFIDENCE',
        'HIGH_RISK_ACTION',
        'FINANCIAL_THRESHOLD',
        'SENSITIVE_DATA',
        'DESTRUCTIVE_OPERATION',
        'WORKFLOW_CHANGE',
        'SELF_HEAL_LOW_CONFIDENCE',
        'AUTHENTICATION_CHANGE',
        'POLICY_VIOLATION',
      ],
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'HIGH',
    },
    confidence: {
      type: Number,
      default: 0.8,
    },
    description: {
      type: String,
      required: true,
    },
    proposedAction: {
      type: String,
      required: true,
    },
    inputSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    reasoningSummary: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
      default: 'PENDING',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    modifiedInput: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApprovalRequest', approvalRequestSchema);
