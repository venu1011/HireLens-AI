const Resume = require('../models/Resume');
const parseResume = require('../services/pdfParser');
const calculateATSScore = require('../services/atsScorer');

// @desc    Upload and parse resume
// @route   POST /api/resume/upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF.' });
    }

    // Parse PDF
    const { rawText, structuredData } = await parseResume(req.file.buffer);

    // Calculate ATS Score
    const atsScore = calculateATSScore(rawText, structuredData);

    // Get version number
    const existingCount = await Resume.countDocuments({ userId: req.user._id });

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      rawText,
      structuredData,
      atsScore,
      version: existingCount + 1
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      resume
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error processing resume', error: error.message });
  }
};

// @desc    Get all resumes for user
// @route   GET /api/resume
exports.getResumes = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [total, resumes] = await Promise.all([
      Resume.countDocuments({ userId: req.user._id }),
      Resume.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-rawText')
    ]);

    res.json({
      success: true,
      count: resumes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      resumes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
};

// @desc    Get single resume
// @route   GET /api/resume/:id
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume', error: error.message });
  }
};

// @desc    Get version history with score progression
// @route   GET /api/resume/history
exports.getVersionHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ version: 1 })
      .select('fileName version atsScore createdAt');

    const history = resumes.map(r => ({
      id: r._id,
      fileName: r.fileName,
      version: r.version,
      atsScore: r.atsScore.total,
      createdAt: r.createdAt
    }));

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};
