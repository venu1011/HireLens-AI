/**
 * Diff Generator — produces highlighted segments for resume vs JD comparison
 */
const { SKILL_ALIASES, skillInText, normalizeSkill } = require('./jobAnalyzer');

const WEAK_VERBS = ['worked on', 'helped with', 'was responsible for', 'did', 'made', 'used', 'assisted'];

/**
 * Find all occurrences of a pattern in text (case-insensitive) and return their positions
 */
function findAllPositions(text, pattern) {
  const positions = [];
  if (!pattern || pattern.length < 2) return positions;
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, 'gi');
  let match;
  while ((match = regex.exec(text)) !== null) {
    positions.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
  }
  return positions;
}

/**
 * Generate highlights for resume text
 * Returns array of { start, end, text, type, label }
 *   type: 'matched' | 'missing' | 'weak_verb' | 'metric'
 */
function generateResumeHighlights(resumeText, matchedSkills, missingSkills) {
  const highlights = [];

  // Highlight matched skills (green)
  matchedSkills.forEach(skill => {
    const aliases = SKILL_ALIASES[skill] || [skill.toLowerCase()];
    const allTerms = [skill, ...aliases];
    allTerms.forEach(term => {
      findAllPositions(resumeText, term).forEach(pos => {
        highlights.push({ ...pos, type: 'matched', label: skill });
      });
    });
  });

  // Highlight weak verbs (yellow)
  WEAK_VERBS.forEach(verb => {
    findAllPositions(resumeText, verb).forEach(pos => {
      highlights.push({ ...pos, type: 'weak_verb', label: 'Weak verb' });
    });
  });

  // Highlight metrics/numbers (blue)
  const metricRegex = /\d+[%+]?[\s]*(users|customers|projects|increase|decrease|revenue|improvement|faster|reduction|sales|clients|uptime|requests|hours|days|team members|engineers)/gi;
  let match;
  while ((match = metricRegex.exec(resumeText)) !== null) {
    highlights.push({ start: match.index, end: match.index + match[0].length, text: match[0], type: 'metric', label: 'Metric' });
  }

  // Also highlight standalone numbers with % or + or K or M
  const numberRegex = /\b\d+(?:\.\d+)?[%+KkMm]\b/g;
  while ((match = numberRegex.exec(resumeText)) !== null) {
    // Avoid duplicates
    const exists = highlights.some(h => h.start <= match.index && h.end >= match.index + match[0].length);
    if (!exists) {
      highlights.push({ start: match.index, end: match.index + match[0].length, text: match[0], type: 'metric', label: 'Metric' });
    }
  }

  // Remove overlapping highlights (prefer matched > weak_verb > metric)
  return deduplicateHighlights(highlights);
}

/**
 * Generate highlights for job description text
 * Returns array of { start, end, text, type, label }
 *   type: 'matched' | 'missing' | 'preferred'
 */
function generateJDHighlights(jdText, matchedSkills, missingSkills, preferredSkills = []) {
  const highlights = [];

  // Highlight matched skills (green)
  matchedSkills.forEach(skill => {
    const aliases = SKILL_ALIASES[skill] || [skill.toLowerCase()];
    const allTerms = [skill, ...aliases];
    allTerms.forEach(term => {
      findAllPositions(jdText, term).forEach(pos => {
        highlights.push({ ...pos, type: 'matched', label: skill });
      });
    });
  });

  // Highlight missing skills (red)
  missingSkills.forEach(skill => {
    const aliases = SKILL_ALIASES[skill] || [skill.toLowerCase()];
    const allTerms = [skill, ...aliases];
    allTerms.forEach(term => {
      findAllPositions(jdText, term).forEach(pos => {
        highlights.push({ ...pos, type: 'missing', label: skill });
      });
    });
  });

  // Highlight preferred skills
  preferredSkills.forEach(skill => {
    const aliases = SKILL_ALIASES[skill] || [skill.toLowerCase()];
    const allTerms = [skill, ...aliases];
    allTerms.forEach(term => {
      findAllPositions(jdText, term).forEach(pos => {
        // Only add if not already highlighted as matched/missing
        const exists = highlights.some(h => h.start === pos.start && h.end === pos.end);
        if (!exists) {
          highlights.push({ ...pos, type: 'preferred', label: `${skill} (preferred)` });
        }
      });
    });
  });

  return deduplicateHighlights(highlights);
}

/**
 * Remove overlapping highlights — keep the highest priority one
 * Priority: matched > missing > weak_verb > preferred > metric
 */
function deduplicateHighlights(highlights) {
  const priority = { matched: 4, missing: 3, weak_verb: 2, preferred: 1, metric: 0 };
  highlights.sort((a, b) => a.start - b.start || priority[b.type] - priority[a.type]);

  const result = [];
  let lastEnd = -1;

  for (const h of highlights) {
    if (h.start >= lastEnd) {
      result.push(h);
      lastEnd = h.end;
    } else if (priority[h.type] > priority[result[result.length - 1]?.type]) {
      // Replace last if higher priority
      result[result.length - 1] = h;
      lastEnd = h.end;
    }
  }

  return result;
}

module.exports = { generateResumeHighlights, generateJDHighlights };
