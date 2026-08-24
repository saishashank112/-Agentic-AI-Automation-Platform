const express = require('express');
const router = express.Router();
const optimizerController = require('../controllers/optimizerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:workflowId', optimizerController.getWorkflowOptimizations);
router.post('/:workflowId/apply/:suggestionId', optimizerController.applyOptimization);

module.exports = router;
