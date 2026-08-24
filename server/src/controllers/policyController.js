const policyService = require('../services/policyService');

const getPolicies = async (req, res) => {
  try {
    const list = await policyService.getPolicies(req.user.id);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const createPolicy = async (req, res) => {
  try {
    const doc = await policyService.createPolicy(req.user.id, req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const doc = await policyService.updatePolicy(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const deletePolicy = async (req, res) => {
  try {
    await policyService.deletePolicy(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Policy deleted' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
};
