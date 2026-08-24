const mongoose = require('mongoose');

const healingOperationSchema = new mongoose.Schema(
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
    strategy: {
      type: String,
      enum: [
        'RETRY',
        'RETRY_WITH_BACKOFF',
        'REFRESH_AUTH',
        'REMAP_FIELDS',
        'REGENERATE_NODE_CONFIG',
        'SKIP_OPTIONAL_NODE',
        'USE_FALLBACK_NODE',
        'MODIFY_WORKFLOW',
        'ROLLBACK_WORKFLOW',
        'ESCALATE_TO_HUMAN',
        'CANCEL_EXECUTION',
      ],
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    originalConfig: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    proposedConfig: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    patch: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['PROPOSED', 'APPLIED', 'REJECTED', 'FAILED'],
      default: 'PROPOSED',
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reexecutionType: {
      type: String,
      enum: ['FULL_REEXECUTION', 'PARTIAL_REEXECUTION'],
      default: 'PARTIAL_REEXECUTION',
    },
    nodesRecovered: {
      type: Number,
      default: 1,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealingOperation', healingOperationSchema);
