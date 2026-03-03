/**
 * ATS Score Calculator
 * Scores resume on 5 dimensions totaling 100%
 * - Keyword Match:        40%
 * - Section Completeness: 20%
 * - Action Verbs:         15%
 * - Measurable Metrics:   15%
 * - Formatting Rules:     10%
 */

const STRONG_ACTION_VERBS = [
  'developed', 'built', 'designed', 'implemented', 'created', 'architected', 'engineered',
  'deployed', 'optimized', 'improved', 'increased', 'reduced', 'delivered', 'led', 'managed',
  'coordinated', 'collaborated', 'automated', 'integrated', 'launched', 'spearheaded',
  'established', 'streamlined', 'transformed', 'achieved', 'accelerated', 'generated',
  'resolved', 'migrated', 'refactored', 'analyzed', 'researched', 'published', 'mentored'
];

const WEAK_VERBS = ['worked', 'helped', 'did', 'made', 'used', 'was responsible for', 'assisted'];

const REQUIRED_SECTIONS = ['skills', 'education', 'experience', 'projects'];
const OPTIONAL_SECTIONS = ['certifications', 'summary', 'objective'];

const calculateATSScore = (rawText, structuredData) => {
  const lower = rawText.toLowerCase();
  const feedback = [];

  // 1. Keyword Match Score (40 pts)
  const skillCount = structuredData.skills.length;
  let keywordScore = Math.min(40, skillCount * 2);
  if (skillCount < 8) feedback.push('Add more technical skills (aim for 10+ skills).');
  if (skillCount >= 15) keywordScore = 40;

  // 2. Section Completeness Score (20 pts)
  let sectionScore = 0;
  const requiredPresent = REQUIRED_SECTIONS.filter(s => lower.includes(s));
  sectionScore += (requiredPresent.length / REQUIRED_SECTIONS.length) * 15;

  const optionalPresent = OPTIONAL_SECTIONS.filter(s => lower.includes(s));
  sectionScore += (optionalPresent.length / OPTIONAL_SECTIONS.length) * 5;
  sectionScore = Math.round(sectionScore);

  const missingSections = REQUIRED_SECTIONS.filter(s => !lower.includes(s));
  if (missingSections.length > 0) {
    feedback.push(`Missing sections: ${missingSections.join(', ')}.`);
  }

  // 3. Action Verbs Score (15 pts)
  const strongVerbsUsed = STRONG_ACTION_VERBS.filter(v => lower.includes(v));
  const weakVerbsUsed = WEAK_VERBS.filter(v => lower.includes(v));
  let actionVerbScore = Math.min(15, strongVerbsUsed.length * 1.5);
  actionVerbScore = Math.round(actionVerbScore);

  if (weakVerbsUsed.length > 0) {
    feedback.push(`Replace weak verbs: "${weakVerbsUsed.slice(0, 3).join('", "')}" with stronger action verbs.`);
  }
  if (strongVerbsUsed.length < 5) {
    feedback.push('Use more strong action verbs (e.g., developed, optimized, implemented).');
  }

  // 4. Measurable Metrics Score (15 pts)
  const metricsPatterns = [
    /\d+\s*%/g,          // percentages
    /\$\s*\d+/g,         // dollar amounts
    /\d+[kKmM]\+?/g,     // large numbers (10k, 5M)
    /\d+x\s/g,           // multipliers (3x)
    /\d+\s*(users?|clients?|teams?|members?|projects?|systems?)/gi
  ];

  let metricsCount = 0;
  metricsPatterns.forEach(pattern => {
    const matches = rawText.match(pattern);
    if (matches) metricsCount += matches.length;
  });

  let metricsScore = Math.min(15, metricsCount * 2);
  if (metricsCount < 3) {
    feedback.push('Add measurable achievements (e.g., "improved performance by 40%", "served 10k users").');
  }

  // 5. Formatting Rules Score (10 pts)
  let formattingScore = 0;
  const wordCount = rawText.split(/\s+/).length;

  if (wordCount >= 300) formattingScore += 3;
  if (wordCount <= 800) formattingScore += 2;
  else feedback.push('Resume is too long. Keep it under 1 page for early-career or 2 pages max.');

  if (structuredData.email) formattingScore += 2;
  else feedback.push('Add your email address.');

  if (structuredData.phone) formattingScore += 2;
  else feedback.push('Add a phone number.');

  if (structuredData.name) formattingScore += 1;

  const total = Math.round(keywordScore + sectionScore + actionVerbScore + metricsScore + formattingScore);

  return {
    total: Math.min(100, total),
    breakdown: {
      keywordMatch: Math.round(keywordScore),
      sectionCompleteness: Math.round(sectionScore),
      actionVerbs: actionVerbScore,
      measurableMetrics: metricsScore,
      formattingRules: formattingScore
    },
    feedback
  };
};

module.exports = calculateATSScore;
