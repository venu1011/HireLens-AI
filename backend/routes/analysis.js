const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  analyzeResume,
  getAnalyses,
  getAnalysis,
  deleteAnalysis
} = require('../controllers/analysisController');

router.post('/analyze', auth, analyzeResume);
router.get('/', auth, getAnalyses);
router.get('/:id', auth, getAnalysis);
router.delete('/:id', auth, deleteAnalysis);

module.exports = router;
