const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  companyWebsite: { type: String, default: '' },
  logo: { type: String, default: 'https://via.placeholder.com/50' },
  location: { type: String, required: true },
  salary: { type: String, default: 'Not Disclosed' }, // Relaxed from required
  experience: { type: String, default: 'Not Specified' }, // Relaxed from required
  deadline: { type: Date, default: () => new Date(+new Date() + 30*24*60*60*1000) }, // Default 30 days
  category: { type: String, required: true }, // e.g., Engineering, Marketing
  tags: [{ type: String }],
  
  // External Job Fields
  applyUrl: { type: String, default: '' },
  source: { type: String, default: 'Platform' }, // 'Remotive', 'RemoteOK', 'Adzuna', 'Platform'
  externalId: { type: String },
  uniqueKey: { type: String, unique: true }, // generated from title + company
  publishedAt: { type: Date, default: Date.now },

  // New Fields
  workType: { type: String, default: 'Full Time' },
  workingDays: { type: String, default: '5 Days/Week' },
  userType: { type: String, default: 'Professional' },
  
  description: { type: String, default: '' },
  responsibilities: [{ type: String }],
  skills: [{ type: String }],
  optionalSkills: [{ type: String }],
  perks: [{ type: String }],
  
  organizer: {
    name: { type: String, default: 'HR' },
    email: { type: String, default: 'hr@company.com' },
    phone: { type: String, default: '' }
  },

  createdAt: { type: Date, default: Date.now }
});

// Create index for deduplication and queries

jobSchema.index({ source: 1, externalId: 1 });

module.exports = mongoose.model('Job', jobSchema);
