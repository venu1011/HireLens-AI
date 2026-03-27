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
  downloadPDF,
  generateCoverLetter,
  generateInterviewQuestions,
  updateRoadmapStatus
} = require('../controllers/analysisController');

router.post('/analyze', auth, analyzeResume);
router.get('/', auth, getAnalyses);
router.get('/:id', auth, getAnalysis);
router.delete('/:id', auth, deleteAnalysis);
router.get('/:id/diff', auth, getDiff);
router.post('/:id/optimize', auth, autoOptimize);
router.post('/:id/download-pdf', auth, downloadPDF);
router.post('/:id/cover-letter', auth, generateCoverLetter);
router.post('/:id/interview-prep', auth, generateInterviewQuestions);
router.patch('/:id/roadmap/:skillId', auth, updateRoadmapStatus);

module.exports = router;
