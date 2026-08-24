const express = require('express');
const executionController = require('../controllers/executionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', executionController.getExecutions);
router.get('/:id', executionController.getExecutionById);
router.get('/:id/timeline', executionController.getTimelineLogs);
router.post('/:id/pause', executionController.pause);
router.post('/:id/resume', executionController.resume);
router.post('/:id/cancel', executionController.cancel);

module.exports = router;
