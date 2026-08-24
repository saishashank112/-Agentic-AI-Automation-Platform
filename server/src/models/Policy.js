const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    conditions: {
      field: { type: String, required: true },
      operator: { type: String, enum: ['>', '<', '==', '!=', 'contains'], default: '>' },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    action: {
      type: String,
      enum: ['REQUIRE_HUMAN_APPROVAL', 'BLOCK_EXECUTION', 'AUTO_HEAL'],
      default: 'REQUIRE_HUMAN_APPROVAL',
    },
    priority: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Policy', policySchema);
