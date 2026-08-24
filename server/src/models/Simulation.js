const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
    },
    workflowVersion: {
      type: Number,
      default: 1,
    },
    mode: {
      type: String,
      enum: ['SIMULATION'],
      default: 'SIMULATION',
    },
    riskScore: {
      type: Number, // 0 - 100
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'LOW',
    },
    confidence: {
      type: Number,
      default: 0.9,
    },
    estimatedDurationMs: {
      type: Number,
      default: 5000,
    },
    predictedFailures: [
      {
        nodeId: String,
        type: String,
        severity: String,
        probability: Number,
        reason: String,
      },
    ],
    dependencies: [
      {
        type: String,
      },
    ],
    recommendations: [
      {
        type: String,
      },
    ],
    scenarios: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Simulation', simulationSchema);
