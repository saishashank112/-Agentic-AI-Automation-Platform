const mongoose = require('mongoose');
const Workflow = require('../models/Workflow');
const Execution = require('../models/Execution');
const memDb = require('../config/memDb');

const createWorkflow = async (userId, data) => {
  if (mongoose.connection.readyState === 1) {
    const workflow = await Workflow.create({
      owner: userId,
      name: data.name || 'Untitled Workflow',
      description: data.description || '',
      triggerConfig: data.triggerConfig || { type: 'manual' },
      nodes: data.nodes || [],
      edges: data.edges || [],
      tags: data.tags || [],
      status: data.status || 'draft',
      version: 1,
    });
    return workflow;
  } else {
    return await memDb.createWorkflow({
      owner: userId,
      name: data.name || 'Untitled Workflow',
      description: data.description || '',
      triggerConfig: data.triggerConfig || { type: 'manual' },
      nodes: data.nodes || [],
      edges: data.edges || [],
      tags: data.tags || [],
      status: data.status || 'draft',
      version: 1,
    });
  }
};

const getWorkflowsByUser = async (userId, query = {}) => {
  if (mongoose.connection.readyState === 1) {
    const filter = { owner: userId };
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    return await Workflow.find(filter).sort({ updatedAt: -1 });
  } else {
    return await memDb.findWorkflowsByUser(userId, query.search || '');
  }
};

const getWorkflowById = async (id, userId) => {
  if (mongoose.connection.readyState === 1) {
    const workflow = await Workflow.findOne({ _id: id, owner: userId });
    if (!workflow) throw new Error('Workflow not found or unauthorized');
    return workflow;
  } else {
    const workflow = await memDb.findWorkflowById(id, userId);
    if (!workflow) throw new Error('Workflow not found or unauthorized');
    return workflow;
  }
};

const updateWorkflow = async (id, userId, updates) => {
  if (mongoose.connection.readyState === 1) {
    const workflow = await Workflow.findOne({ _id: id, owner: userId });
    if (!workflow) throw new Error('Workflow not found or unauthorized');

    if (updates.name !== undefined) workflow.name = updates.name;
    if (updates.description !== undefined) workflow.description = updates.description;
    if (updates.status !== undefined) workflow.status = updates.status;
    if (updates.nodes !== undefined) workflow.nodes = updates.nodes;
    if (updates.edges !== undefined) workflow.edges = updates.edges;
    if (updates.triggerConfig !== undefined) workflow.triggerConfig = updates.triggerConfig;
    if (updates.tags !== undefined) workflow.tags = updates.tags;

    workflow.version = (workflow.version || 1) + 1;
    await workflow.save();
    return workflow;
  } else {
    const workflow = await memDb.updateWorkflow(id, userId, updates);
    if (!workflow) throw new Error('Workflow not found or unauthorized');
    return workflow;
  }
};

const duplicateWorkflow = async (id, userId) => {
  const original = await getWorkflowById(id, userId);
  return await createWorkflow(userId, {
    name: `${original.name} (Copy)`,
    description: original.description,
    status: 'draft',
    triggerConfig: original.triggerConfig,
    nodes: original.nodes,
    edges: original.edges,
    tags: original.tags,
  });
};

const deleteWorkflow = async (id, userId) => {
  if (mongoose.connection.readyState === 1) {
    const workflow = await Workflow.findOneAndDelete({ _id: id, owner: userId });
    if (!workflow) throw new Error('Workflow not found or unauthorized');
    return workflow;
  } else {
    const workflow = await memDb.deleteWorkflow(id, userId);
    if (!workflow) throw new Error('Workflow not found or unauthorized');
    return workflow;
  }
};

const getDashboardStats = async (userId) => {
  const userWorkflows = await getWorkflowsByUser(userId);
  let executions = [];

  if (mongoose.connection.readyState === 1) {
    const workflowIds = userWorkflows.map((w) => w._id);
    executions = await Execution.find({ workflowId: { $in: workflowIds } }).sort({ createdAt: -1 });
  } else {
    executions = await memDb.findExecutionsByUser(userId);
  }

  const totalWorkflows = userWorkflows.length;
  const activeWorkflows = userWorkflows.filter((w) => w.status === 'active').length;
  const totalExecutions = executions.length;
  const successfulExecutions = executions.filter((e) => e.status === 'COMPLETED').length;
  const failedExecutions = executions.filter((e) => e.status === 'FAILED').length;
  const successRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 100;

  return {
    totalWorkflows,
    activeWorkflows,
    totalExecutions,
    successfulExecutions,
    failedExecutions,
    successRate,
    recentExecutions: executions.slice(0, 5),
  };
};

module.exports = {
  createWorkflow,
  getWorkflowsByUser,
  getWorkflowById,
  updateWorkflow,
  duplicateWorkflow,
  deleteWorkflow,
  getDashboardStats,
};
