const simulationService = require('../services/simulationService');

const simulate = async (req, res) => {
  try {
    const { id } = req.params;
    const { scenarioCondition } = req.body;
    const report = await simulationService.simulateWorkflow(id, req.user.id, scenarioCondition);
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const getSimulations = async (req, res) => {
  try {
    const list = await simulationService.getSimulationsByWorkflow(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getSimulationById = async (req, res) => {
  try {
    const doc = await simulationService.getSimulationById(req.params.id);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  simulate,
  getSimulations,
  getSimulationById,
};
