/**
 * Skill Gap Roadmap Generator
 * Generates learning plans for missing skills
 */

const SKILL_ROADMAPS = {
  // Frontend
  'React': {
    level: 'intermediate',
    topics: ['JSX & Components', 'Props & State', 'Hooks (useState, useEffect)', 'React Router', 'Context API', 'Redux Toolkit', 'Performance Optimization'],
    resources: ['React Official Docs', 'Scrimba React Course', 'Full Stack Open (Helsinki)', 'Traversy Media - React Crash Course'],
    estimatedTime: '4-6 weeks'
  },
  'Vue': {
    level: 'intermediate',
    topics: ['Vue Instance & Templates', 'Directives', 'Components', 'Vue Router', 'Vuex / Pinia', 'Composition API'],
    resources: ['Vue Official Docs', 'Vue Mastery', 'Scrimba Vue Course'],
    estimatedTime: '3-5 weeks'
  },
  'Angular': {
    level: 'intermediate',
    topics: ['TypeScript Basics', 'Components & Modules', 'Services & DI', 'Angular Router', 'RxJS Observables', 'HttpClient', 'Angular Material'],
    resources: ['Angular Official Docs', 'Udemy - Angular - The Complete Guide', 'Angular University'],
    estimatedTime: '5-7 weeks'
  },
  'Typescript': {
    level: 'intermediate',
    topics: ['Types & Interfaces', 'Generics', 'Enums', 'Union & Intersection Types', 'Type Guards', 'Decorators', 'tsconfig'],
    resources: ['TypeScript Official Handbook', 'Total TypeScript', 'Execute Program TypeScript'],
    estimatedTime: '2-3 weeks'
  },
  // Backend
  'Node.Js': {
    level: 'intermediate',
    topics: ['Node.js Core Modules', 'Event Loop', 'Streams & Buffers', 'Express.js', 'Middleware', 'Error Handling', 'Authentication'],
    resources: ['Node.js Official Docs', 'The Odin Project', 'Traversy Media - Node.js Crash Course'],
    estimatedTime: '4-6 weeks'
  },
  'Express': {
    level: 'beginner',
    topics: ['Routing', 'Middleware', 'Request & Response', 'Template Engines', 'REST API Design', 'Error Handling', 'Security'],
    resources: ['Express Official Docs', 'FreeCodeCamp Express Tutorial', 'Traversy Media'],
    estimatedTime: '2-3 weeks'
  },
  'Django': {
    level: 'intermediate',
    topics: ['Django Models & ORM', 'Views & URL Routing', 'Templates', 'Django REST Framework', 'Authentication', 'Admin Panel', 'Deployment'],
    resources: ['Official Django Tutorial', 'Django REST Framework Docs', 'Corey Schafer Django Series'],
    estimatedTime: '4-6 weeks'
  },
  'Flask': {
    level: 'beginner',
    topics: ['Routing & Views', 'Templates (Jinja2)', 'Forms & Validation', 'SQLAlchemy', 'Flask Blueprints', 'REST APIs', 'Authentication'],
    resources: ['Flask Official Docs', 'Corey Schafer Flask Series', 'Miguel Grinberg Flask Tutorial'],
    estimatedTime: '3-4 weeks'
  },
  'Fastapi': {
    level: 'intermediate',
    topics: ['Path Operations', 'Request Body & Validation', 'Pydantic Models', 'Async Support', 'Dependency Injection', 'OAuth2', 'OpenAPI'],
    resources: ['FastAPI Official Docs', 'TestDriven.io FastAPI', 'ArjanCodes FastAPI Tutorial'],
    estimatedTime: '2-3 weeks'
  },
  // Databases
  'Mongodb': {
    level: 'beginner',
    topics: ['Documents & Collections', 'CRUD Operations', 'Aggregation Pipeline', 'Indexes', 'Schema Design', 'Mongoose ODM', 'Atlas Cloud'],
    resources: ['MongoDB University (Free)', 'Mongoose Docs', 'Traversy Media MongoDB Crash Course'],
    estimatedTime: '2-3 weeks'
  },
  'Postgresql': {
    level: 'intermediate',
    topics: ['SQL Fundamentals', 'Tables & Relations', 'Joins & Subqueries', 'Indexes & Performance', 'Transactions', 'Stored Procedures', 'PgAdmin'],
    resources: ['PostgreSQL Official Docs', 'Full Stack Python', 'Mode Analytics SQL Tutorial'],
    estimatedTime: '3-4 weeks'
  },
  'Redis': {
    level: 'intermediate',
    topics: ['Data Structures', 'Strings, Lists, Sets, Hashes', 'Expiry & TTL', 'Pub/Sub', 'Caching Patterns', 'Session Management'],
    resources: ['Redis Official Docs', 'Redis University (Free)', 'Traversy Media Redis Tutorial'],
    estimatedTime: '2-3 weeks'
  },
  // Cloud & DevOps
  'Docker': {
    level: 'intermediate',
    topics: ['Containers vs VMs', 'Dockerfile', 'Docker Images', 'Docker Compose', 'Networking', 'Volumes', 'Docker Hub'],
    resources: ['Docker Official Docs', 'TechWorld with Nana - Docker Tutorial', 'Play With Docker'],
    estimatedTime: '2-3 weeks'
  },
  'Kubernetes': {
    level: 'advanced',
    topics: ['Pods & Nodes', 'Deployments & Services', 'ConfigMaps & Secrets', 'Ingress', 'Helm Charts', 'RBAC', 'Scaling'],
    resources: ['Kubernetes Official Docs', 'TechWorld with Nana - Kubernetes', 'KodeKloud Kubernetes'],
    estimatedTime: '4-6 weeks'
  },
  'Aws': {
    level: 'intermediate',
    topics: ['IAM & Security', 'EC2 & Auto Scaling', 'S3', 'RDS / DynamoDB', 'Lambda & Serverless', 'API Gateway', 'CloudFormation'],
    resources: ['AWS Free Tier', 'AWS Skill Builder', 'Stephane Maarek Udemy Courses', 'Cloud Quest (AWS)'],
    estimatedTime: '6-8 weeks'
  },
  // AI/ML
  'Machine Learning': {
    level: 'advanced',
    topics: ['Linear & Logistic Regression', 'Decision Trees', 'Ensemble Methods', 'SVM', 'Clustering', 'Feature Engineering', 'Model Evaluation'],
    resources: ['Andrew Ng ML Course (Coursera)', 'Hands-On ML (Aurélien Géron)', 'Kaggle Courses', 'Fast.ai'],
    estimatedTime: '8-12 weeks'
  },
  'Tensorflow': {
    level: 'advanced',
    topics: ['Tensors & Operations', 'Keras API', 'Neural Network Layers', 'CNNs & RNNs', 'Transfer Learning', 'Model Saving', 'TF Serving'],
    resources: ['TensorFlow Official Docs', 'DeepLearning.AI TF Developer Certificate', 'MIT 6.S191'],
    estimatedTime: '6-8 weeks'
  },
  'Pytorch': {
    level: 'advanced',
    topics: ['Tensors & Autograd', 'nn.Module', 'Training Loop', 'CNNs', 'RNNs & Transformers', 'Distributed Training', 'TorchScript'],
    resources: ['PyTorch Official Tutorials', 'Fast.ai Practical DL', 'Andrej Karpathy Tutorials'],
    estimatedTime: '6-8 weeks'
  },
  // Default fallback
  'DEFAULT': {
    level: 'beginner',
    topics: ['Fundamentals & Core Concepts', 'Practical Exercises', 'Build Projects', 'Review Documentation', 'Practice Interviews'],
    resources: ['Official Documentation', 'YouTube Tutorials', 'Udemy Courses', 'FreeCodeCamp', 'GitHub Projects'],
    estimatedTime: '3-4 weeks'
  }
};

const generateRoadmap = (missingSkills) => {
  return missingSkills.slice(0, 8).map(skill => {
    const key = Object.keys(SKILL_ROADMAPS).find(
      k => k.toLowerCase() === skill.toLowerCase() ||
           skill.toLowerCase().includes(k.toLowerCase())
    ) || 'DEFAULT';

    const template = SKILL_ROADMAPS[key];

    return {
      skill,
      level: template.level,
      topics: template.topics,
      resources: template.resources,
      estimatedTime: template.estimatedTime
    };
  });
};

module.exports = generateRoadmap;
