const express = require('express');
const router = express.Router();
const multer = require('multer');
const { param } = require('express-validator');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const {
  uploadResume,
  getResumes,
  getResume,
  deleteResume,
  getVersionHistory
} = require('../controllers/resumeController');

// Store file in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

router.post('/upload', auth, upload.single('resume'), uploadResume);
router.get('/', auth, getResumes);
router.get('/history', auth, getVersionHistory);
router.get('/:id', auth, [param('id').isMongoId().withMessage('Invalid resume id'), validateRequest], getResume);
router.delete('/:id', auth, [param('id').isMongoId().withMessage('Invalid resume id'), validateRequest], deleteResume);

module.exports = router;
