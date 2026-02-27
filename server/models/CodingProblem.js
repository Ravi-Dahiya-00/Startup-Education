const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  constraints: {
    type: String,
    default: ''
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  starterCode: {
    type: Map,
    of: String, // Language -> Code
    default: {}
  },
  testCases: [{
    input: { type: String, required: true },
    output: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
  }],
  order: {
    type: Number,
    default: 0
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CodingProblem = mongoose.model('CodingProblem', codingProblemSchema);

module.exports = CodingProblem;
