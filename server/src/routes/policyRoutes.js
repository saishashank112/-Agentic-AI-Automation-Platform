const express = require('express');
const policyController = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(policyController.getPolicies)
  .post(policyController.createPolicy);

router.route('/:id')
  .put(policyController.updatePolicy)
  .delete(policyController.deletePolicy);

module.exports = router;
