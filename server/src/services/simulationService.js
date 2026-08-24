const mongoose = require('mongoose');
const Simulation = require('../models/Simulation');
const workflowService = require('./workflowService');
const simulationAgent = require('../agents/simulationAgent');
const memDb = require('../config/memDb');

const simulateWorkflow = async (workflowId, userId, scenarioCondition = null) => {
  const workflow = await workflowService.getWorkflowById(workflowId, userId);
  const simReport = await simulationAgent.simulateWorkflow(workflow, scenarioCondition);

  let doc;
  if (mongoose.connection.readyState === 1) {
    doc = await Simulation.create({
      ...simReport,
      createdBy: userId,
    });
  } else {
    doc = await memDb.createSimulation({
      ...simReport,
      createdBy: userId,
    });
  }
  return doc;
};

const getSimulationsByWorkflow = async (workflowId, userId) => {
  if (mongoose.connection.readyState === 1) {
    return await Simulation.find({ workflowId }).sort({ createdAt: -1 });
  } else {
    return await memDb.findSimulationsByWorkflow(workflowId);
  }
};

const getSimulationById = async (id) => {
  if (mongoose.connection.readyState === 1) {
    return await Simulation.findById(id);
  } else {
    return await memDb.findSimulationById(id);
  }
};

module.exports = {
  simulateWorkflow,
  getSimulationsByWorkflow,
  getSimulationById,
};
