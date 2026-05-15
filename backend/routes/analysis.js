const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { aiLimiter } = require('../middleware/rateLimit');
const {
  analyzeResume,
  getAnalyses,
  getAnalysis,
  deleteAnalysis,
  getDiff,
  autoOptimize,
  downloadPDF,
  exportAnalysis,
  generateCoverLetter,
  generateInterviewQuestions,
  updateRoadmapStatus
} = require('../controllers/analysisController');

const validateAnalysisId = [param('id').isMongoId().withMessage('Invalid analysis id'), validateRequest];
const validateRoadmapId = [
  param('id').isMongoId().withMessage('Invalid analysis id'),
  param('skillId').isMongoId().withMessage('Invalid roadmap item id'),
  validateRequest
];

router.post('/analyze', auth, aiLimiter, [
  body('resumeId').isMongoId().withMessage('Valid resumeId is required'),
  body('jobDescription')
    .isString().withMessage('Job description is required')
    .trim()
    .isLength({ min: 10, max: 10000 }).withMessage('Job description must be 10-10000 chars'),
  body('jobTitle').optional().isString().isLength({ max: 120 }).withMessage('Job title too long'),
  body('useAI').optional().customSanitizer((value) => {
    if (value === true || value === false) return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  }).isBoolean().withMessage('useAI must be boolean'),
  validateRequest
], analyzeResume);
router.get('/', auth, getAnalyses);
router.get('/:id', auth, validateAnalysisId, getAnalysis);
router.delete('/:id', auth, validateAnalysisId, deleteAnalysis);
router.get('/:id/diff', auth, validateAnalysisId, getDiff);
router.post('/:id/optimize', auth, aiLimiter, validateAnalysisId, autoOptimize);
router.post('/:id/download-pdf', auth, validateAnalysisId, downloadPDF);
router.get('/:id/export', auth, validateAnalysisId, exportAnalysis);
router.post('/:id/cover-letter', auth, aiLimiter, validateAnalysisId, generateCoverLetter);
router.post('/:id/interview-prep', auth, aiLimiter, validateAnalysisId, generateInterviewQuestions);
router.patch('/:id/roadmap/:skillId', auth, validateRoadmapId, updateRoadmapStatus);

module.exports = router;
