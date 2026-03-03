const { GoogleGenerativeAI } = require('@google/generative-ai');

const WEAK_VERBS = ['worked on', 'helped with', 'was responsible for', 'did', 'made', 'used', 'assisted'];

const VERB_REPLACEMENTS = {
  'worked on': 'developed',
  'helped with': 'contributed to',
  'was responsible for': 'led',
  'did': 'executed',
  'made': 'built',
  'used': 'leveraged',
  'assisted': 'supported',
  'helped': 'facilitated'
};

/**
 * Rule-based suggestion generator
 */
const generateSuggestions = (rawText, structuredData, missingSkills) => {
  const suggestions = [];
  const lower = rawText.toLowerCase();

  // Check for weak verbs
  WEAK_VERBS.forEach(verb => {
    if (lower.includes(verb)) {
      suggestions.push({
        type: 'weak_verb',
        message: `Replace "${verb}" with a stronger action verb`,
        original: verb,
        improved: VERB_REPLACEMENTS[verb] || 'a stronger action verb'
      });
    }
  });

  // Check for missing quantification
  const bulletPoints = rawText.split('\n').filter(l => l.trim().startsWith('•') || l.trim().startsWith('-'));
  const bulletsWithNumbers = bulletPoints.filter(b => /\d/.test(b));

  if (bulletPoints.length > 0 && bulletsWithNumbers.length / bulletPoints.length < 0.3) {
    suggestions.push({
      type: 'missing_metrics',
      message: 'Add measurable achievements to your bullet points (numbers, percentages, scale)',
      original: 'Built a web application',
      improved: 'Built a web application serving 5,000+ monthly active users with 99.9% uptime'
    });
  }

  // Check for missing professional summary
  const hasSummary = /summary|objective|profile/i.test(rawText);
  if (!hasSummary) {
    suggestions.push({
      type: 'missing_section',
      message: 'Add a professional summary/objective section at the top of your resume',
      original: '',
      improved: 'Results-driven Software Engineer with X years of experience in [your stack]. Proven track record of building scalable applications and delivering impactful solutions.'
    });
  }

  // Suggest adding missing skills
  if (missingSkills.length > 0) {
    suggestions.push({
      type: 'missing_skills',
      message: `Consider adding these skills to your resume if you have experience: ${missingSkills.slice(0, 5).join(', ')}`,
      original: '',
      improved: ''
    });
  }

  // Check resume length
  const wordCount = rawText.split(/\s+/).length;
  if (wordCount < 200) {
    suggestions.push({
      type: 'too_short',
      message: 'Your resume appears too short. Expand your experience and project sections with more detail.',
      original: '',
      improved: ''
    });
  }

  // Check for contact info
  if (!structuredData.email) {
    suggestions.push({
      type: 'missing_contact',
      message: 'Ensure your email address is visible in your resume.',
      original: '',
      improved: ''
    });
  }

  // Check for GitHub/LinkedIn
  if (!/github|linkedin/i.test(rawText)) {
    suggestions.push({
      type: 'missing_links',
      message: 'Add links to your GitHub profile and LinkedIn to increase credibility.',
      original: '',
      improved: ''
    });
  }

  return suggestions;
};

/**
 * Google Gemini-powered suggestion generator
 */
const generateAISuggestions = async (resumeText, jobDescription, missingSkills) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const prompt = `You are a professional resume coach and ATS expert.

Given this resume:
${resumeText.substring(0, 2000)}

And this job description:
${jobDescription.substring(0, 1000)}

Missing skills: ${missingSkills.join(', ')}

Provide 5 specific, actionable improvements to make this resume better match the job.
Focus on:
1. Rewriting weak bullet points to be stronger and more quantified
2. Adding relevant keywords naturally
3. Improving the professional summary
4. Structure and section ordering
5. Skills to highlight or add

Return a JSON array of exactly 5 improvement suggestion strings. Example format:
["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]`;

  const result = await model.generateContent(prompt);
  const content = result.response.text();

  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return content.split('\n').filter(l => l.trim()).slice(0, 5);
  } catch {
    return content.split('\n').filter(l => l.trim()).slice(0, 5);
  }
};

/**
 * Rewrite a single bullet point using Gemini
 */
const rewriteBullet = async (bulletText, context) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const prompt = `Rewrite this resume bullet point to be more impactful, specific, and quantified.
Use strong action verbs and add estimated impact if not provided.
Context: ${context || 'Software Engineering'}

Original: "${bulletText}"

Return only the improved bullet point, nothing else.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

module.exports = generateSuggestions;
module.exports.generateAISuggestions = generateAISuggestions;
module.exports.rewriteBullet = rewriteBullet;
