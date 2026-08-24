const mongoose = require('mongoose');
const Execution = require('../models/Execution');
const ExecutionLog = require('../models/ExecutionLog');
const Workflow = require('../models/Workflow');
const workflowService = require('./workflowService');
const memDb = require('../config/memDb');
const { addExecutionToQueue } = require('../queues/executionQueue');

const createAndStartExecution = async (workflowId, userId, inputs = {}) => {
  const workflow = await workflowService.getWorkflowById(workflowId, userId);

  let execution;
  if (mongoose.connection.readyState === 1) {
    execution = await Execution.create({
      workflowId: workflow._id,
      workflowSnapshot: workflow,
      status: 'PENDING',
      inputs,
      retryCount: 0,
    });
  } else {
    execution = await memDb.createExecution({
      workflowId: workflow._id,
      workflowSnapshot: workflow,
      status: 'PENDING',
      inputs,
      retryCount: 0,
    });
  }

  await addExecutionToQueue(execution._id.toString(), userId.toString());
  return execution;
};

const getExecutionsByUser = async (userId, query = {}) => {
  if (mongoose.connection.readyState === 1) {
    const userWorkflows = await Workflow.find({ owner: userId }).select('_id');
    const workflowIds = userWorkflows.map((w) => w._id);
    const filter = { workflowId: { $in: workflowIds } };
    if (query.status) filter.status = query.status;

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const executions = await Execution.find(filter)
      .populate('workflowId', 'name description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Execution.countDocuments(filter);

    return {
      executions,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  } else {
    const executions = await memDb.findExecutionsByUser(userId);
    return {
      executions,
      pagination: { total: executions.length, page: 1, limit: 20, pages: 1 },
    };
  }
};

const getExecutionById = async (id, userId) => {
  if (mongoose.connection.readyState === 1) {
    const execution = await Execution.findById(id).populate('workflowId', 'name description owner');
    if (!execution) throw new Error('Execution run not found');
    return execution;
  } else {
    const execution = await memDb.findExecutionById(id);
    if (!execution) throw new Error('Execution run not found');
    return execution;
  }
};

const getExecutionTimelineLogs = async (executionId) => {
  if (mongoose.connection.readyState === 1) {
    return await ExecutionLog.find({ executionId }).sort({ timestamp: 1 });
  } else {
    return await memDb.findLogsByExecution(executionId);
  }
};

const pauseExecution = async (id, userId) => {
  const execution = await getExecutionById(id, userId);
  if (execution.status === 'RUNNING' || execution.status === 'PENDING') {
    execution.status = 'PAUSED';
    if (mongoose.connection.readyState === 1) {
      await execution.save();
    } else {
      await memDb.updateExecution(id, { status: 'PAUSED' });
    }
  }
  return execution;
};

const resumeExecution = async (id, userId) => {
  const execution = await getExecutionById(id, userId);
  if (execution.status === 'PAUSED') {
    execution.status = 'PENDING';
    if (mongoose.connection.readyState === 1) {
      await execution.save();
    } else {
      await memDb.updateExecution(id, { status: 'PENDING' });
    }
    await addExecutionToQueue(execution._id.toString(), userId.toString());
  }
  return execution;
};

const cancelExecution = async (id, userId) => {
  const execution = await getExecutionById(id, userId);
  execution.status = 'CANCELLED';
  execution.endTime = new Date();
  execution.duration = execution.endTime - (execution.startTime || new Date());
  if (mongoose.connection.readyState === 1) {
    await execution.save();
  } else {
    await memDb.updateExecution(id, { status: 'CANCELLED', endTime: execution.endTime, duration: execution.duration });
  }
  return execution;
};

module.exports = {
  createAndStartExecution,
  getExecutionsByUser,
  getExecutionById,
  getExecutionTimelineLogs,
  pauseExecution,
  resumeExecution,
  cancelExecution,
};
