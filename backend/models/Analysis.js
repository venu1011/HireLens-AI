const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String
  },
  matchScore: {
    type: Number,
    default: 0
  },
  matchedSkills: [String],
  missingSkills: [String],
  extraSkills: [String],
  requiredSkills: [String],
  preferredSkills: [String],
  suggestions: {
    basic: [
      {
        type: { type: String },
        message: String,
        original: String,
        improved: String
      }
    ],
    ai: [String]
  },
  roadmap: [
    {
      skill: String,
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
      topics: [String],
      resources: [String],
      estimatedTime: String,
      status: { type: String, enum: ['pending', 'in-progress', 'learned'], default: 'pending' }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
