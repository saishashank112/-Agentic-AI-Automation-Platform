const express = require('express');
const approvalController = require('../controllers/approvalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', approvalController.getApprovals);
router.get('/:id', approvalController.getApprovalById);
router.post('/:id/approve', approvalController.approve);
router.post('/:id/reject', approvalController.reject);
router.post('/:id/modify', approvalController.modify);

module.exports = router;
