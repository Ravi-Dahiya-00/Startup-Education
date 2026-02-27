const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  providerLogo: { type: String, default: '' },
  amount: { type: String, required: true },
  deadline: { type: String, required: true },
  eligibility: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  benefits: [{ type: String }],
  requirements: [{ type: String }],
  howToApply: { type: String, default: '' },
  applicationLink: { type: String, default: '' },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  applicants: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
