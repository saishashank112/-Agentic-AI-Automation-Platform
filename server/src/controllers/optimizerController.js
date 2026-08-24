const optimizerService = require('../services/optimizerService');

const getWorkflowOptimizations = async (req, res, next) => {
  try {
    const { workflowId } = req.params;
    const result = await optimizerService.analyzeWorkflow(workflowId, req.user._id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const applyOptimization = async (req, res, next) => {
  try {
    const { workflowId, suggestionId } = req.params;
    const result = await optimizerService.applyOptimization(workflowId, req.user._id, suggestionId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWorkflowOptimizations,
  applyOptimization,
};
