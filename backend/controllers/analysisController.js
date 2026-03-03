const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const analyzeJobDescription = require('../services/jobAnalyzer');
const { normalizeSkill } = require('../services/jobAnalyzer');
const generateSuggestions = require('../services/aiSuggestions');
const generateRoadmap = require('../services/roadmapGenerator');

// @desc    Analyze resume against job description
// @route   POST /api/analysis/analyze
exports.analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription, jobTitle, useAI } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ message: 'Resume ID and job description are required' });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Analyze job description
    const jobAnalysis = analyzeJobDescription(jobDescription);

    // Normalize resume skills to canonical names for accurate matching
    const resumeSkillsCanonical = resume.structuredData.skills.map(s => normalizeSkill(s));

    const requiredSkills = jobAnalysis.requiredSkills;   // already canonical
    const preferredSkills = jobAnalysis.preferredSkills; // already canonical

    const matchedSkills = requiredSkills.filter(skill =>
      resumeSkillsCanonical.includes(skill)
    );
    const missingSkills = requiredSkills.filter(skill =>
      !resumeSkillsCanonical.includes(skill)
    );
    const allJobSkills = [...requiredSkills, ...preferredSkills];
    const extraSkills = resumeSkillsCanonical.filter(skill =>
      !allJobSkills.includes(skill)
    );

    const matchScore = requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

    // Generate basic suggestions
    const basicSuggestions = generateSuggestions(resume.rawText, resume.structuredData, missingSkills);

    // Generate AI suggestions if requested
    let aiSuggestions = [];
    if (useAI) {
      if (!process.env.GEMINI_API_KEY) {
        aiSuggestions = ['AI suggestions unavailable — GEMINI_API_KEY not set in .env'];
      } else {
        try {
          const { generateAISuggestions } = require('../services/aiSuggestions');
          aiSuggestions = await generateAISuggestions(resume.rawText, jobDescription, missingSkills);
        } catch (aiError) {
          console.error('AI suggestions error:', aiError.message);
          // Try fallback model if primary fails
          try {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const prompt = `Given this resume and job, list 5 specific improvements as a JSON array of strings:\nResume: ${resume.rawText.substring(0, 1500)}\nJob: ${jobDescription.substring(0, 800)}\nMissing skills: ${missingSkills.join(', ')}\nReturn only: ["tip1","tip2","tip3","tip4","tip5"]`;
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const match = text.match(/\[[\s\S]*\]/);
            aiSuggestions = match ? JSON.parse(match[0]) : text.split('\n').filter(Boolean).slice(0, 5);
          } catch (fallbackErr) {
            console.error('Fallback model also failed:', fallbackErr.message);
            aiSuggestions = ['AI suggestions temporarily unavailable. Please try again later.'];
          }
        }
      }
    }

    // Generate skill gap roadmap
    const roadmap = generateRoadmap(missingSkills);

    // Save analysis
    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeId,
      jobDescription,
      jobTitle,
      matchScore,
      matchedSkills,
      missingSkills,
      extraSkills,
      requiredSkills: jobAnalysis.requiredSkills,
      preferredSkills: jobAnalysis.preferredSkills,
      suggestions: {
        basic: basicSuggestions,
        ai: aiSuggestions
      },
      roadmap
    });

    res.status(201).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Error analyzing resume', error: error.message });
  }
};

// @desc    Get all analyses for user
// @route   GET /api/analysis
exports.getAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('resumeId', 'fileName version atsScore')
      .select('-jobDescription -roadmap');

    res.json({ success: true, count: analyses.length, analyses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analyses', error: error.message });
  }
};

// @desc    Get single analysis
// @route   GET /api/analysis/:id
exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('resumeId', 'fileName version atsScore structuredData');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analysis', error: error.message });
  }
};

// @desc    Delete analysis
// @route   DELETE /api/analysis/:id
exports.deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({ success: true, message: 'Analysis deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting analysis', error: error.message });
  }
};
