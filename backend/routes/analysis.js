const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  analyzeResume,
  getAnalyses,
  getAnalysis,
  deleteAnalysis,
  getDiff,
  autoOptimize,
  downloadPDF
} = require('../controllers/analysisController');

router.post('/analyze', auth, analyzeResume);
router.get('/', auth, getAnalyses);
router.get('/:id', auth, getAnalysis);
router.delete('/:id', auth, deleteAnalysis);
router.get('/:id/diff', auth, getDiff);
router.post('/:id/optimize', auth, autoOptimize);
router.post('/:id/download-pdf', auth, downloadPDF);

module.exports = router;
