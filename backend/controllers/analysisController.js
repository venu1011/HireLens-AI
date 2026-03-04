const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const analyzeJobDescription = require('../services/jobAnalyzer');
const { normalizeSkill } = require('../services/jobAnalyzer');
const generateSuggestions = require('../services/aiSuggestions');
const generateRoadmap = require('../services/roadmapGenerator');
const { generateResumeHighlights, generateJDHighlights } = require('../services/diffGenerator');
const PDFDocument = require('pdfkit');

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

// @desc    Get diff view data (resume + JD with highlights)
// @route   GET /api/analysis/:id/diff
exports.getDiff = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('resumeId', 'rawText structuredData fileName');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const resumeText = analysis.resumeId?.rawText || '';
    const jdText = analysis.jobDescription || '';

    const resumeHighlights = generateResumeHighlights(
      resumeText,
      analysis.matchedSkills || [],
      analysis.missingSkills || []
    );

    const jdHighlights = generateJDHighlights(
      jdText,
      analysis.matchedSkills || [],
      analysis.missingSkills || [],
      analysis.preferredSkills || []
    );

    res.json({
      success: true,
      diff: {
        resume: { text: resumeText, highlights: resumeHighlights },
        jd: { text: jdText, highlights: jdHighlights },
        stats: {
          matchedCount: analysis.matchedSkills?.length || 0,
          missingCount: analysis.missingSkills?.length || 0,
          extraCount: analysis.extraSkills?.length || 0,
          matchScore: analysis.matchScore
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating diff', error: error.message });
  }
};

// @desc    Auto-optimize resume for a job using Gemini AI
// @route   POST /api/analysis/:id/optimize
exports.autoOptimize = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('resumeId', 'rawText structuredData fileName');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ message: 'GEMINI_API_KEY not configured' });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const resumeText = analysis.resumeId?.rawText || '';
    const jdText = analysis.jobDescription || '';
    const missingSkills = analysis.missingSkills || [];
    const matchedSkills = analysis.matchedSkills || [];

    const prompt = `You are an expert resume optimizer and ATS specialist.

Given this resume:
${resumeText.substring(0, 3000)}

And this target job description:
${jdText.substring(0, 1500)}

The resume currently matches these skills: ${matchedSkills.join(', ')}
These skills are MISSING from the resume: ${missingSkills.join(', ')}

Your task: Rewrite and optimize the resume to better match this specific job. 

Rules:
1. Keep ALL existing truthful information — never fabricate experience
2. Reorder sections to prioritize relevant experience first
3. Rewrite the professional summary to target this specific role
4. Strengthen weak bullet points with action verbs and estimated metrics
5. Naturally weave in missing keywords WHERE the candidate likely has that experience
6. Improve formatting with clear section headers
7. Keep it concise (1-2 pages worth of content)

Return ONLY the optimized resume text formatted with clear sections (PROFESSIONAL SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION). Use bullet points (•) for experience items. Do not include any explanation before or after — just the resume text.`;

    const result = await model.generateContent(prompt);
    const optimizedText = result.response.text().trim();

    // Also generate a changelog of what was changed
    const changelogPrompt = `Compare these two resume texts and list exactly what was changed in 5-8 bullet points. Be specific.

ORIGINAL:
${resumeText.substring(0, 2000)}

OPTIMIZED:
${optimizedText.substring(0, 2000)}

Return a JSON array of change description strings. Example: ["Rewrote summary to target X role", "Added missing keyword Y to skills section"]
Return ONLY the JSON array.`;

    const changelogResult = await model.generateContent(changelogPrompt);
    const changelogText = changelogResult.response.text();
    let changelog;
    try {
      const jsonMatch = changelogText.match(/\[[\s\S]*\]/);
      changelog = jsonMatch ? JSON.parse(jsonMatch[0]) : changelogText.split('\n').filter(Boolean).slice(0, 8);
    } catch {
      changelog = changelogText.split('\n').filter(l => l.trim()).slice(0, 8);
    }

    res.json({
      success: true,
      optimized: {
        text: optimizedText,
        changelog,
        originalLength: resumeText.length,
        optimizedLength: optimizedText.length,
        missingSkillsAddressed: missingSkills.filter(skill =>
          optimizedText.toLowerCase().includes(skill.toLowerCase())
        )
      }
    });
  } catch (error) {
    console.error('Auto-optimize error:', error);
    res.status(500).json({ message: 'Error optimizing resume', error: error.message });
  }
};

// @desc    Download optimized resume as PDF
// @route   POST /api/analysis/:id/download-pdf
exports.downloadPDF = async (req, res) => {
  try {
    const { text, title } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Resume text is required' });
    }

    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
      info: {
        Title: title || 'Optimized Resume',
        Author: 'HireLens AI',
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="optimized-resume.pdf"`);
    doc.pipe(res);

    const lines = text.split('\n');
    const sectionHeaders = ['PROFESSIONAL SUMMARY', 'SKILLS', 'EXPERIENCE', 'PROJECTS', 'EDUCATION', 'CERTIFICATIONS', 'CONTACT', 'TECHNICAL SKILLS'];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        doc.moveDown(0.3);
        continue;
      }

      const isHeader = sectionHeaders.some(h => trimmed.toUpperCase().includes(h));
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
      const isSubHeader = /^[A-Z].*\|/.test(trimmed) || /^[A-Z].*—/.test(trimmed) || /^[A-Z].*\d{4}/.test(trimmed);

      if (isHeader) {
        doc.moveDown(0.6);
        doc.font('Helvetica-Bold').fontSize(13).fillColor('#1a1a2e').text(trimmed.toUpperCase());
        doc.moveDown(0.15);
        doc.strokeColor('#3b82f6').lineWidth(0.8)
          .moveTo(doc.x, doc.y).lineTo(doc.x + 495, doc.y).stroke();
        doc.moveDown(0.3);
      } else if (isSubHeader) {
        doc.moveDown(0.2);
        doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#333').text(trimmed);
      } else if (isBullet) {
        doc.font('Helvetica').fontSize(10).fillColor('#444')
          .text(trimmed, { indent: 15, lineGap: 2 });
      } else {
        doc.font('Helvetica').fontSize(10).fillColor('#444')
          .text(trimmed, { lineGap: 2 });
      }
    }

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};
