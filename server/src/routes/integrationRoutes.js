const express = require('express');
const integrationController = require('../controllers/integrationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/status', protect, integrationController.getStatus);
router.get('/oauth/:provider/start', protect, integrationController.startOAuth);
router.get('/oauth/:provider/callback', integrationController.handleCallback);

router.use(protect);
router.get('/', integrationController.getIntegrations);
router.post('/', integrationController.saveManualCredentials);

module.exports = router;
