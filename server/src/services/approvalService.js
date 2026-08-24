const mongoose = require('mongoose');
const ApprovalRequest = require('../models/ApprovalRequest');
const executionService = require('./executionService');
const orchestrator = require('../agents/orchestrator');
const memDb = require('../config/memDb');

const getApprovals = async (userId, query = {}) => {
  if (mongoose.connection.readyState === 1) {
    const filter = {};
    if (query.status) filter.status = query.status;
    return await ApprovalRequest.find(filter).populate('workflowId', 'name description').sort({ createdAt: -1 });
  } else {
    return await memDb.findApprovalRequests(query);
  }
};

const getApprovalById = async (id) => {
  if (mongoose.connection.readyState === 1) {
    return await ApprovalRequest.findById(id).populate('workflowId', 'name description').populate('executionId');
  } else {
    return await memDb.findApprovalRequestById(id);
  }
};

const approveRequest = async (id, userId) => {
  let doc;
  if (mongoose.connection.readyState === 1) {
    doc = await ApprovalRequest.findByIdAndUpdate(
      id,
      { status: 'APPROVED', approvedBy: userId, approvedAt: new Date() },
      { new: true }
    );
  } else {
    doc = await memDb.updateApprovalRequest(id, { status: 'APPROVED', approvedBy: userId, approvedAt: new Date() });
  }

  if (doc) {
    // Resume Execution
    setImmediate(async () => {
      try {
        await executionService.resumeExecution(doc.executionId.toString(), userId.toString());
      } catch (err) {
        console.error('Resume execution error:', err.message);
      }
    });
  }

  return doc;
};

const rejectRequest = async (id, userId, rejectionReason = '') => {
  let doc;
  if (mongoose.connection.readyState === 1) {
    doc = await ApprovalRequest.findByIdAndUpdate(
      id,
      { status: 'REJECTED', approvedBy: userId, rejectionReason },
      { new: true }
    );
  } else {
    doc = await memDb.updateApprovalRequest(id, { status: 'REJECTED', approvedBy: userId, rejectionReason });
  }

  if (doc) {
    await executionService.cancelExecution(doc.executionId.toString(), userId.toString());
  }

  return doc;
};

const modifyAndApproveRequest = async (id, userId, modifiedInput) => {
  let doc;
  if (mongoose.connection.readyState === 1) {
    doc = await ApprovalRequest.findByIdAndUpdate(
      id,
      { status: 'APPROVED', approvedBy: userId, approvedAt: new Date(), modifiedInput },
      { new: true }
    );
  } else {
    doc = await memDb.updateApprovalRequest(id, { status: 'APPROVED', approvedBy: userId, approvedAt: new Date(), modifiedInput });
  }

  if (doc) {
    // Resume Execution with modified input
    setImmediate(async () => {
      try {
        await executionService.resumeExecution(doc.executionId.toString(), userId.toString());
      } catch (err) {
        console.error('Resume modified execution error:', err.message);
      }
    });
  }

  return doc;
};

module.exports = {
  getApprovals,
  getApprovalById,
  approveRequest,
  rejectRequest,
  modifyAndApproveRequest,
};
