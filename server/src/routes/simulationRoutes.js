const express = require('express');
const simulationController = require('../controllers/simulationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/workflows/:id/simulate', simulationController.simulate);
router.get('/workflows/:id/simulations', simulationController.getSimulations);
router.get('/simulations/:id', simulationController.getSimulationById);
router.post('/simulations/:id/scenario', simulationController.simulate);

module.exports = router;
