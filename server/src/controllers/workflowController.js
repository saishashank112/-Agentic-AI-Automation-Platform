const workflowService = require('../services/workflowService');
const aiService = require('../services/aiService');
const executionService = require('../services/executionService');

const createWorkflow = async (req, res) => {
  try {
    const workflow = await workflowService.createWorkflow(req.user.id, req.body);
    res.status(201).json({ success: true, data: workflow });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const generateFromPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    const generatedGraph = await aiService.generateWorkflowFromPrompt(prompt);
    res.status(200).json({ success: true, data: generatedGraph });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getWorkflows = async (req, res) => {
  try {
    const workflows = await workflowService.getWorkflowsByUser(req.user.id, req.query);
    res.status(200).json({ success: true, data: workflows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await workflowService.getDashboardStats(req.user.id);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getWorkflowById = async (req, res) => {
  try {
    const workflow = await workflowService.getWorkflowById(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: workflow });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

const updateWorkflow = async (req, res) => {
  try {
    const workflow = await workflowService.updateWorkflow(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, data: workflow });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const duplicateWorkflow = async (req, res) => {
  try {
    const clone = await workflowService.duplicateWorkflow(req.params.id, req.user.id);
    res.status(201).json({ success: true, data: clone });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const executeWorkflow = async (req, res) => {
  try {
    const execution = await executionService.createAndStartExecution(req.params.id, req.user.id, req.body.inputs || {});
    res.status(200).json({ success: true, data: execution });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const deleteWorkflow = async (req, res) => {
  try {
    await workflowService.deleteWorkflow(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Workflow deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  createWorkflow,
  generateFromPrompt,
  getWorkflows,
  getDashboardStats,
  getWorkflowById,
  updateWorkflow,
  duplicateWorkflow,
  executeWorkflow,
  deleteWorkflow,
};
