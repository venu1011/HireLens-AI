const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  structuredData: {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    education: [
      {
        degree: String,
        institution: String,
        year: String
      }
    ],
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        bullets: [String]
      }
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String]
      }
    ],
    certifications: [String],
    summary: String
  },
  atsScore: {
    total: { type: Number, default: 0 },
    grade: { type: String, default: 'F' },
    breakdown: {
      keywordMatch: Number,
      sectionCompleteness: Number,
      actionVerbs: Number,
      measurableMetrics: Number,
      formattingRules: Number
    },
    feedback: [mongoose.Schema.Types.Mixed],
    strengths: [String]
  },
  version: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
