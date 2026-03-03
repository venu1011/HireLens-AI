/**
 * Job Description Analyzer — robust skill extraction with alias mapping
 */

// Each canonical skill maps to all its known aliases (case-insensitive)
const SKILL_ALIASES = {
  'JavaScript': ['javascript', 'js', 'es6', 'ecmascript', 'vanilla js'],
  'TypeScript': ['typescript', 'ts'],
  'React': ['react', 'reactjs', 'react.js'],
  'Vue': ['vue', 'vuejs', 'vue.js'],
  'Angular': ['angular', 'angularjs'],
  'Next.js': ['next.js', 'nextjs', 'next js'],
  'Node.js': ['node.js', 'nodejs', 'node js'],
  'Express': ['express', 'expressjs', 'express.js'],
  'NestJS': ['nestjs', 'nest.js'],
  'Redux': ['redux', 'redux toolkit'],
  'GraphQL': ['graphql', 'graph ql'],
  'Webpack': ['webpack'],
  'Vite': ['vite'],
  'Jest': ['jest'],
  'Cypress': ['cypress'],
  'Python': ['python', 'python3'],
  'Django': ['django'],
  'Flask': ['flask'],
  'FastAPI': ['fastapi', 'fast api'],
  'Pandas': ['pandas'],
  'NumPy': ['numpy'],
  'Scikit-Learn': ['scikit-learn', 'sklearn', 'scikit learn'],
  'TensorFlow': ['tensorflow', 'tensor flow'],
  'PyTorch': ['pytorch', 'py torch'],
  'Java': ['java'],
  'Spring': ['spring', 'spring boot', 'springboot'],
  'Kotlin': ['kotlin'],
  'C++': ['c++', 'cpp'],
  'C#': ['c#', 'csharp', '.net', 'dotnet'],
  'Go': ['golang', 'go lang'],
  'Rust': ['rust'],
  'Ruby': ['ruby'],
  'Rails': ['rails', 'ruby on rails'],
  'PHP': ['php'],
  'Laravel': ['laravel'],
  'Swift': ['swift'],
  'MongoDB': ['mongodb', 'mongo'],
  'MySQL': ['mysql'],
  'PostgreSQL': ['postgresql', 'postgres'],
  'SQLite': ['sqlite'],
  'Redis': ['redis'],
  'Firebase': ['firebase', 'firestore'],
  'DynamoDB': ['dynamodb'],
  'SQL': ['sql'],
  'AWS': ['aws', 'amazon web services', 'ec2', 'lambda'],
  'Azure': ['azure', 'microsoft azure'],
  'GCP': ['gcp', 'google cloud'],
  'Docker': ['docker', 'dockerfile'],
  'Kubernetes': ['kubernetes', 'k8s', 'kubectl'],
  'CI/CD': ['ci/cd', 'github actions', 'jenkins', 'continuous integration'],
  'Terraform': ['terraform'],
  'Linux': ['linux', 'ubuntu', 'unix', 'bash'],
  'Git': ['git', 'version control'],
  'GitHub': ['github'],
  'GitLab': ['gitlab'],
  'Machine Learning': ['machine learning', ' ml '],
  'Deep Learning': ['deep learning', 'neural network'],
  'NLP': ['nlp', 'natural language processing'],
  'REST API': ['rest api', 'restful api', 'restful'],
  'Microservices': ['microservices', 'micro services'],
  'Agile': ['agile', 'scrum', 'kanban'],
  'JWT': ['jwt', 'json web token'],
  'OAuth': ['oauth', 'oauth2'],
  'Tailwind CSS': ['tailwind', 'tailwindcss'],
  'Bootstrap': ['bootstrap'],
  'SASS': ['sass', 'scss'],
  'HTML': ['html', 'html5'],
  'CSS': ['css', 'css3'],
  'Figma': ['figma'],
  'Jira': ['jira'],
  'Selenium': ['selenium'],
  'Postman': ['postman'],
};

// Build reverse map: alias → canonical
const ALIAS_MAP = {};
Object.entries(SKILL_ALIASES).forEach(([canonical, aliases]) => {
  ALIAS_MAP[canonical.toLowerCase()] = canonical;
  aliases.forEach(a => { ALIAS_MAP[a.toLowerCase()] = canonical; });
});

/**
 * Normalize any skill string to its canonical name
 */
const normalizeSkill = (raw) => {
  const lower = raw.toLowerCase().trim();
  if (ALIAS_MAP[lower]) return ALIAS_MAP[lower];
  return raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

/**
 * Check text for a skill using word-boundary-safe regex
 */
const skillInText = (text, aliases) => {
  const lower = text.toLowerCase();
  return aliases.some(alias => {
    if (alias.trim().length < 2) return false;
    const esc = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![a-z0-9])${esc}(?![a-z0-9])`, 'i').test(lower);
  });
};

const PREFERRED_SIGNALS = [
  'preferred', 'nice to have', 'bonus', 'plus', 'ideally',
  'advantageous', 'desirable', 'good to have', 'familiar with', 'exposure to'
];

const analyzeJobDescription = (jobDescription) => {
  const lower = jobDescription.toLowerCase();
  const requiredSkills = new Set();
  const preferredSkills = new Set();

  Object.entries(SKILL_ALIASES).forEach(([canonical, aliases]) => {
    if (!skillInText(jobDescription, [canonical, ...aliases])) return;

    // Find context around the skill mention
    const testAlias = [canonical, ...aliases].find(a => {
      if (a.trim().length < 2) return false;
      const esc = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(?<![a-z0-9])${esc}(?![a-z0-9])`, 'i').test(lower);
    });
    if (!testAlias) return;

    const idx = lower.indexOf(testAlias.toLowerCase());
    const context = lower.substring(Math.max(0, idx - 250), idx + 80);
    const isPreferred = PREFERRED_SIGNALS.some(s => context.includes(s));

    if (isPreferred) preferredSkills.add(canonical);
    else requiredSkills.add(canonical);
  });

  const experienceMatches = jobDescription.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/gi) || [];
  const educationMatch = jobDescription.match(/(bachelor|master|phd|b\.tech|m\.tech|degree)/gi) || [];

  return {
    requiredSkills: [...requiredSkills],
    preferredSkills: [...preferredSkills],
    allKeywords: [...requiredSkills, ...preferredSkills],
    experienceRequired: experienceMatches[0] || null,
    educationRequired: educationMatch[0] || null,
    totalKeywords: requiredSkills.size + preferredSkills.size
  };
};

module.exports = analyzeJobDescription;
module.exports.normalizeSkill = normalizeSkill;
module.exports.skillInText = skillInText;
module.exports.SKILL_ALIASES = SKILL_ALIASES;
