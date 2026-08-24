const healingService = require('../services/healingService');

const analyzeFailure = async (req, res) => {
  try {
    const result = await healingService.analyzeExecutionFailure(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const getRootCause = async (req, res) => {
  try {
    const rca = await healingService.getRootCauseByExecution(req.params.id);
    res.status(200).json({ success: true, data: rca });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getHealing = async (req, res) => {
  try {
    const list = await healingService.getHealingByExecution(req.params.id);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const approve = async (req, res) => {
  try {
    const doc = await healingService.approveHealing(req.params.healingId, req.user.id);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const reject = async (req, res) => {
  try {
    const doc = await healingService.rejectHealing(req.params.healingId, req.user.id);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  analyzeFailure,
  getRootCause,
  getHealing,
  approve,
  reject,
};
