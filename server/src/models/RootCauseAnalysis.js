const mongoose = require('mongoose');

const rootCauseAnalysisSchema = new mongoose.Schema(
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
    errorType: {
      type: String,
      required: true,
    },
    rootCause: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'HIGH',
    },
    confidence: {
      type: Number,
      required: true,
    },
    recommendedAction: {
      type: String,
      required: true,
    },
    affectedNode: {
      type: String,
      required: true,
    },
    requiresHumanApproval: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RootCauseAnalysis', rootCauseAnalysisSchema);
