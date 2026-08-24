const executionService = require('../services/executionService');

const getExecutions = async (req, res) => {
  try {
    const result = await executionService.getExecutionsByUser(req.user.id, req.query);
    res.status(200).json({ success: true, data: result.executions, pagination: result.pagination });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getExecutionById = async (req, res) => {
  try {
    const execution = await executionService.getExecutionById(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: execution });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

const getTimelineLogs = async (req, res) => {
  try {
    const logs = await executionService.getExecutionTimelineLogs(req.params.id);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const pause = async (req, res) => {
  try {
    const execution = await executionService.pauseExecution(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: execution });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const resume = async (req, res) => {
  try {
    const execution = await executionService.resumeExecution(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: execution });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const cancel = async (req, res) => {
  try {
    const execution = await executionService.cancelExecution(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: execution });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getExecutions,
  getExecutionById,
  getTimelineLogs,
  pause,
  resume,
  cancel,
};
