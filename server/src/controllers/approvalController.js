const approvalService = require('../services/approvalService');

const getApprovals = async (req, res) => {
  try {
    const list = await approvalService.getApprovals(req.user.id, req.query);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getApprovalById = async (req, res) => {
  try {
    const doc = await approvalService.getApprovalById(req.params.id);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

const approve = async (req, res) => {
  try {
    const doc = await approvalService.approveRequest(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const reject = async (req, res) => {
  try {
    const { reason } = req.body;
    const doc = await approvalService.rejectRequest(req.params.id, req.user.id, reason);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const modify = async (req, res) => {
  try {
    const { modifiedInput } = req.body;
    const doc = await approvalService.modifyAndApproveRequest(req.params.id, req.user.id, modifiedInput);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getApprovals,
  getApprovalById,
  approve,
  reject,
  modify,
};
