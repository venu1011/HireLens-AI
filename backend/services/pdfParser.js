const pdfParse = require('pdf-parse');
const { SKILL_ALIASES, normalizeSkill, skillInText } = require('./jobAnalyzer');

/**
 * Parse PDF buffer and extract structured resume data
 */
const parseResume = async (buffer) => {
  const data = await pdfParse(buffer);
  const rawText = data.text;

  const structuredData = extractStructuredData(rawText);
  return { rawText, structuredData };
};

const extractStructuredData = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  return {
    name: extractName(lines),
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text),
    education: extractEducation(text, lines),
    experience: extractExperience(text, lines),
    projects: extractProjects(text, lines),
    certifications: extractCertifications(text, lines),
    summary: extractSummary(text, lines)
  };
};

const extractName = (lines) => {
  // Usually the first non-empty line is the name
  return lines[0] || '';
};

const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : '';
};

const extractPhone = (text) => {
  const match = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : '';
};

const extractSkills = (text) => {
  const found = [];

  // Use canonical skill aliases from jobAnalyzer for consistency
  Object.entries(SKILL_ALIASES).forEach(([canonical, aliases]) => {
    if (skillInText(text, [canonical, ...aliases])) {
      found.push(canonical);
    }
  });

  // Also parse the "Skills" section for additional skills not caught by alias matching
  const skillsSection = extractSection(text, ['skills', 'technical skills', 'core competencies']);
  if (skillsSection) {
    const sectionSkills = skillsSection
      .split(/[,\n•|\/\-]/)
      .map(s => s.trim().replace(/^[:·]\s*/, ''))
      .filter(s => s.length > 1 && s.length < 30 && !/^\d+$/.test(s) && !/^(and|or|the|with|for|etc)$/i.test(s));
    sectionSkills.forEach(s => {
      const canonical = normalizeSkill(s);
      // Only add if it looks like a real skill (not a generic phrase)
      if (!found.includes(canonical) && canonical.split(' ').length <= 4) {
        found.push(canonical);
      }
    });
  }

  return [...new Set(found)];
};

const extractSection = (text, sectionNames) => {
  const lines = text.split('\n');
  let inSection = false;
  let content = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    const isSectionHeader = sectionNames.some(name => line === name || line.startsWith(name + ':'));

    if (isSectionHeader) {
      inSection = true;
      continue;
    }

    // Stop at next section
    const isNextSection = /^(experience|education|projects|certifications|skills|summary|objective|work history)/i.test(lines[i].trim()) && !isSectionHeader;
    if (inSection && isNextSection && content.length > 0) break;

    if (inSection) content.push(lines[i]);
  }

  return content.join('\n');
};

const extractEducation = (text, lines) => {
  const degrees = ['bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'b.e', 'mba', 'b.sc', 'm.sc', 'b.com', 'diploma'];
  const education = [];

  lines.forEach((line, i) => {
    const lower = line.toLowerCase();
    if (degrees.some(d => lower.includes(d))) {
      education.push({
        degree: line,
        institution: lines[i + 1] || '',
        year: extractYear(line) || extractYear(lines[i + 1] || '') || ''
      });
    }
  });

  return education;
};

const extractYear = (text) => {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
};

const extractExperience = (text, lines) => {
  const experience = [];
  const jobTitles = ['engineer', 'developer', 'designer', 'analyst', 'manager', 'intern', 'architect', 'consultant', 'specialist'];

  lines.forEach((line, i) => {
    const lower = line.toLowerCase();
    if (jobTitles.some(t => lower.includes(t)) && line.length < 80) {
      const bullets = [];
      for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
        if (lines[j].startsWith('•') || lines[j].startsWith('-') || lines[j].match(/^[A-Z]/)) {
          bullets.push(lines[j]);
        }
      }
      experience.push({
        title: line,
        company: lines[i + 1] || '',
        duration: extractDateRange(lines.slice(i, i + 3).join(' ')),
        bullets
      });
    }
  });

  return experience.slice(0, 5);
};

const extractDateRange = (text) => {
  const match = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*(20\d{2}|19\d{2})\s*[-–]\s*(Present|Current|Now|20\d{2}|19\d{2})?/i);
  return match ? match[0] : '';
};

const extractProjects = (text, lines) => {
  const projects = [];
  let inProjects = false;

  lines.forEach((line, i) => {
    if (/^projects?$/i.test(line)) { inProjects = true; return; }
    if (inProjects && /^(experience|education|skills|certifications)/i.test(line)) { inProjects = false; return; }
    if (inProjects && line.length > 5 && line.length < 80 && !line.startsWith('•')) {
      const techs = extractSkills(lines.slice(i, i + 3).join(' '));
      projects.push({
        name: line,
        description: lines[i + 1] || '',
        technologies: techs.slice(0, 5)
      });
    }
  });

  return projects.slice(0, 6);
};

const extractCertifications = (text, lines) => {
  const certs = [];
  let inCerts = false;

  lines.forEach(line => {
    if (/^certifications?$/i.test(line)) { inCerts = true; return; }
    if (inCerts && /^(experience|education|skills|projects)/i.test(line)) { inCerts = false; return; }
    if (inCerts && line.length > 3) certs.push(line);
  });

  return certs.slice(0, 10);
};

const extractSummary = (text, lines) => {
  let inSummary = false;
  const summary = [];

  for (const line of lines) {
    if (/^(summary|objective|profile|about me)$/i.test(line)) { inSummary = true; continue; }
    if (inSummary && /^(experience|education|skills|projects|certifications)/i.test(line)) break;
    if (inSummary) summary.push(line);
  }

  return summary.join(' ').trim();
};

module.exports = parseResume;
