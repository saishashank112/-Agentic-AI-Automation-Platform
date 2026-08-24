const express = require('express');
const healingController = require('../controllers/healingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/executions/:id/root-cause', healingController.getRootCause);
router.post('/executions/:id/analyze-failure', healingController.analyzeFailure);
router.get('/executions/:id/healing', healingController.getHealing);
router.post('/executions/:id/healing/:healingId/approve', healingController.approve);
router.post('/executions/:id/healing/:healingId/apply', healingController.approve);
router.post('/executions/:id/healing/:healingId/reject', healingController.reject);

module.exports = router;
