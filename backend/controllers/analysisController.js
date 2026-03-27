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
      if (!process.env.NVIDIA_API_KEY) {
        aiSuggestions = ['AI suggestions unavailable — NVIDIA_API_KEY not set in .env'];
      } else {
        try {
          const { generateAISuggestions } = require('../services/aiSuggestions');
          aiSuggestions = await generateAISuggestions(resume.rawText, jobDescription, missingSkills);
        } catch (aiError) {
          console.error('AI suggestions error:', aiError.message);
          // Try fallback if primary fails
          try {
            const OpenAI = require('openai');
            const nvidiya = new OpenAI({
              apiKey: process.env.NVIDIA_API_KEY,
              baseURL: 'https://integrate.api.nvidia.com/v1',
            });
            const prompt = `Given this resume and job, list 5 specific improvements as a JSON array of strings:\nResume: ${resume.rawText.substring(0, 1500)}\nJob: ${jobDescription.substring(0, 800)}\nMissing skills: ${missingSkills.join(', ')}\nReturn only: ["tip1","tip2","tip3","tip4","tip5"]`;
            
            const completion = await nvidiya.chat.completions.create({
              model: process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct",
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.2,
              max_tokens: 512,
            });

            const text = completion.choices[0].message.content;
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

    if (!process.env.NVIDIA_API_KEY) {
      return res.status(400).json({ message: 'NVIDIA_API_KEY not configured' });
    }

    const OpenAI = require('openai');
    const nvidiya = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

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

Return ONLY the optimized resume text formatted with clear sections (PROFESSIONAL SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION). Use bullet points (•) for experience items. Do NOT use any Markdown formatting like **bold** or ### headers — just plain, well-structured text. Do not include any explanation before or after — just the resume text.`;

    const completion = await nvidiya.chat.completions.create({
      model: process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct",
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 3000,
    });

    const optimizedText = completion.choices[0].message.content.trim();

    // Also generate a changelog of what was changed
    const changelogPrompt = `Compare these two resume texts and list exactly what was changed in 5-8 bullet points. Be specific.

ORIGINAL:
${resumeText.substring(0, 2000)}

OPTIMIZED:
${optimizedText.substring(0, 2000)}

Return a JSON array of change description strings. Example: ["Rewrote summary to target X role", "Added missing keyword Y to skills section"]
Return ONLY the JSON array.`;

    const changelogCompletion = await nvidiya.chat.completions.create({
      model: process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct",
      messages: [{ role: 'user', content: changelogPrompt }],
      temperature: 0.2,
      max_tokens: 512,
    });

    const changelogText = changelogCompletion.choices[0].message.content;
    let changelog;
    try {
      const jsonMatch = changelogText.match(/\[[\s\S]*\]/);
      changelog = jsonMatch ? JSON.parse(jsonMatch[0]) : changelogText.split('\n').filter(Boolean).slice(0, 8);
    } catch {
      changelog = changelogText.split('\n').filter(l => l.trim()).slice(0, 8);
    }

    const improvementPrompt = `Compare the ORIGINAL resume with the OPTIMIZED version for the given Job Description:

    JD: ${jdText.substring(0, 1000)}
    ORIGINAL SCORE: ${analysis.matchScore}
    MISSING SKILLS: ${missingSkills.join(', ')}

    Return a JSON object:
    {
      "projectedScore": (0-100 number, how well does the OPTIMIZED version match now?),
      "addressedSkills": ["skill1", "skill2"],
      "impactSummary": "short 1-sentence summary of improvement"
    }
    Return ONLY JSON.`;

    const improvCompletion = await nvidiya.chat.completions.create({
      model: process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct",
      messages: [{ role: 'user', content: improvementPrompt }],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    let improvement;
    try {
      improvement = JSON.parse(improvCompletion.choices[0].message.content.trim());
    } catch {
      improvement = {
        projectedScore: Math.min(99, Math.round(analysis.matchScore * 1.3)),
        addressedSkills: missingSkills.slice(0, 3),
        impactSummary: "Significantly improved keyword density and role alignment."
      };
    }

    res.json({
      success: true,
      text: optimizedText,
      changelog,
      originalScore: analysis.matchScore,
      projectedScore: improvement.projectedScore,
      missingSkillsAddressed: improvement.addressedSkills,
      impactSummary: improvement.impactSummary
    });
  } catch (error) {
    console.error('Auto-optimize error:', error);
    res.status(500).json({ message: 'Error optimizing resume', error: error.message });
  }
};

// @desc    Generate a tailored cover letter using AI
// @route   POST /api/analysis/:id/cover-letter
exports.generateCoverLetter = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate('resumeId');
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis record not found' });
    }

    const OpenAI = require('openai');
    const nvidiya = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const prompt = `Write a professional, high-impact cover letter (1 page length) for a ${analysis.jobTitle || 'relevant'} position.
    
    Job Description context:
    ${analysis.jobDescription.substring(0, 1500)}
    
    Candidate Skills & Experience context:
    ${analysis.resumeId?.rawText?.substring(0, 1500) || 'Generic skills context'}
    
    Guidelines:
    1. Match the job tone (Professional but energetic).
    2. Explicitly mention top skills that align with the job.
    3. Keep it to 3 main body paragraphs (Opening, Value Proposition, Closing).
    4. Start with [Your Name] as the placeholder.
    5. Return ONLY the cover letter text. No intro or outro text. Use plain text formatting.`;

    const completion = await nvidiya.chat.completions.create({
      model: process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    res.json({
      success: true,
      coverLetter: completion.choices[0].message.content.trim()
    });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ message: 'Error generating cover letter', error: error.message });
  }
};

// @desc    Generate interview questions using AI
// @route   POST /api/analysis/:id/interview-prep
exports.generateInterviewQuestions = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate('resumeId');
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis record not found' });
    }

    const OpenAI = require('openai');
    const nvidiya = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const prompt = `Based on the following Job Description and Candidate Resume, generate 10 high-value interview questions.
    
    Job Description:
    ${(analysis.jobDescription || '').substring(0, 1200)}
    
    Candidate Highlights:
    ${(analysis.resumeId?.rawText || '').substring(0, 1200) || 'Strong candidate with relevant experience'}
    
    Return the response as a valid JSON array of objects. Each object must have:
    - "question": The actual interview question.
    - "type": (e.g., "Technical", "Behavioral", "Situational")
    - "intent": Why is the interviewer asking this?
    - "answerOutline": 3-4 bullet points on what the candidate should mention.
    
    Return ONLY the raw JSON array. No explanation before or after.`;

    const completion = await nvidiya.chat.completions.create({
      model: process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      response_format: { type: "json_object" } // Using json_object hint if supported, else just parsing
    });

    let questions = [];
    try {
      const content = completion.choices[0].message.content.trim();
      // Safe parsing
      const parsed = JSON.parse(content);
      questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    } catch (e) {
      console.error('JSON Parse error for interview questions:', e);
      // Fallback or manual extraction if needed, but usually NIM is good at JSON
    }

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Interview prep error:', error);
    res.status(500).json({ message: 'Error generating interview questions', error: error.message });
  }
};

// @desc    Update status of a roadmap skill
// @route   PATCH /api/analysis/:id/roadmap/:skillId
exports.updateRoadmapStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id, skillId } = req.params;

    const analysis = await Analysis.findById(id);
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });

    const roadmapItem = analysis.roadmap.id(skillId);
    if (!roadmapItem) return res.status(404).json({ message: 'Skill not found in roadmap' });

    roadmapItem.status = status;
    await analysis.save();

    res.json({ success: true, roadmap: analysis.roadmap });
  } catch (error) {
    console.error('Update roadmap status error:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// @desc    Download optimized resume as PDF
// @route   POST /api/analysis/:id/download-pdf
exports.downloadPDF = async (req, res) => {
  try {
    const { text, title, template = 'classic' } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (!text) {
      return res.status(400).json({ message: 'Resume text is required' });
    }

    // Template Configurations
    const themes = {
      classic: { nameSize: 15, hSize: 11, bSize: 9, accent: '#000000', secondary: '#444444', line: '#bbbbbb', align: 'left', margin: 50 },
      modern: { nameSize: 20, hSize: 12, bSize: 9.5, accent: '#1e40af', secondary: '#64748b', line: '#3b82f6', align: 'center', margin: 45 },
      minimalist: { nameSize: 14, hSize: 10, bSize: 8.5, accent: '#0f172a', secondary: '#94a3b8', line: '#e2e8f0', align: 'left', margin: 60 }
    };
    const theme = themes[template] || themes.classic;

    const doc = new PDFDocument({
      margin: theme.margin,
      size: 'A4',
      info: { Title: title || 'Optimized Resume', Author: 'HireLens AI' }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="optimized-resume.pdf"`);
    doc.pipe(res);

    const lines = text.split('\n');
    const sections = ['PROFESSIONAL SUMMARY', 'SKILLS', 'EXPERIENCE', 'PROJECTS', 'EDUCATION', 'CERTIFICATIONS', 'CONTACT', 'TECHNICAL SKILLS', 'ADDITIONAL SKILLS'];

    let isNameLine = true;
    let currentSection = '';
    let sectionStep = 0;

    for (const line of lines) {
      let cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      if (!cleanLine) {
        doc.moveDown(0.2);
        continue;
      }

      const isHeader = sections.some(s => cleanLine.toUpperCase() === s || cleanLine.toUpperCase().startsWith(s));
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('* ');

      // 1. Handle Name & Contact (Top)
      if (isNameLine) {
        doc.font('Helvetica-Bold').fontSize(theme.nameSize).fillColor(theme.accent).text(cleanLine.toUpperCase(), { align: theme.align });
        doc.moveDown(0.1);
        isNameLine = false;
        continue;
      }

      if (cleanLine.includes('@') || /[\d\-\+\(\)]{8,}/.test(cleanLine) || cleanLine.toLowerCase().includes('github.com') || cleanLine.toLowerCase().includes('linkedin.com')) {
        doc.font('Helvetica').fontSize(theme.bSize).fillColor(theme.secondary).text(cleanLine, { align: theme.align });
        doc.moveDown(0.3);
        continue;
      }

      // 2. Handle Section Headers
      if (isHeader) {
        currentSection = sections.find(s => cleanLine.toUpperCase().startsWith(s));
        sectionStep = 0;
        doc.moveDown(0.6);
        doc.font('Helvetica-Bold').fontSize(theme.hSize).fillColor(theme.accent).text(cleanLine.toUpperCase(), { characterSpacing: 0.5 });
        doc.moveDown(0.05);
        
        // Subtle decorative line
        if (template !== 'minimalist') {
          doc.strokeColor(theme.line).lineWidth(0.8).moveTo(doc.x, doc.y).lineTo(doc.x + (595 - (theme.margin * 2)), doc.y).stroke();
        }
        doc.moveDown(0.4);
        continue;
      }

      // 3. Handle Content Logic
      if (isBullet) {
        const bulletText = cleanLine.replace(/^[•\-\*]\s*/, '').trim();
        doc.font('Helvetica').fontSize(theme.bSize).fillColor('#111')
          .text('•  ' + bulletText, { indent: 12, lineGap: 2, align: 'justify' });
      } else {
        // Advanced parsing for Subheaders (Job Titles, Project Names, Degrees)
        const hasDate = /(20\d{2}|Present)/i.test(cleanLine);
        const hasPipe = cleanLine.includes('|') || cleanLine.includes('—');
        
        // If it's the first line in Experience/Projects/Education, it's a primary subheader
        const isPrimarySubHeader = sectionStep === 0 && ['EXPERIENCE', 'PROJECTS', 'EDUCATION'].includes(currentSection);
        
        if (isPrimarySubHeader || hasPipe || (hasDate && cleanLine.length < 100)) {
          // Special styling for subheaders
          if (template === 'modern') {
            const parts = cleanLine.split(/[|—]/).map(p => p.trim());
            if (parts.length > 1) {
              doc.font('Helvetica-Bold').fontSize(theme.bSize + 0.5).fillColor('#1a1a2e').text(parts[0], { continued: true });
              doc.font('Helvetica').fontSize(theme.bSize).fillColor(theme.secondary).text('  |  ' + parts.slice(1).join(' | '));
            } else {
              doc.font('Helvetica-Bold').fontSize(theme.bSize + 0.5).fillColor('#1a1a2e').text(cleanLine);
            }
          } else {
            doc.font('Helvetica-Bold').fontSize(theme.bSize).fillColor('#222').text(cleanLine);
          }
          doc.moveDown(0.1);
          sectionStep++;
        } else {
          // Standard body text
          const color = (currentSection === 'SKILLS' || currentSection === 'TECHNICAL SKILLS') ? '#000' : '#333';
          const font = (currentSection === 'SKILLS' || currentSection === 'TECHNICAL SKILLS') ? 'Helvetica-Bold' : 'Helvetica';
          
          doc.font(font).fontSize(theme.bSize).fillColor(color).text(cleanLine, { lineGap: 1.8, align: 'justify' });
          sectionStep++;
        }
      }
    }

    // Page footer
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.font('Helvetica').fontSize(7).fillColor('#999').text(
        `Optimized for ${analysis?.jobTitle || 'Industry Standard'} via HireLens AI`,
        theme.margin, doc.page.height - 30, { align: 'center' }
      );
    }

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};
