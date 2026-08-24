const express = require('express');
const workflowController = require('../controllers/workflowController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/dashboard', workflowController.getDashboardStats);
router.post('/generate', workflowController.generateFromPrompt);

router.route('/')
  .get(workflowController.getWorkflows)
  .post(workflowController.createWorkflow);

router.route('/:id')
  .get(workflowController.getWorkflowById)
  .put(workflowController.updateWorkflow)
  .delete(workflowController.deleteWorkflow);

router.post('/:id/duplicate', workflowController.duplicateWorkflow);
router.post('/:id/execute', workflowController.executeWorkflow);

module.exports = router;
