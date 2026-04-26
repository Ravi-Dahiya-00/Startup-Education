const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  slug: { type: String, unique: true, sparse: true, index: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  companyWebsite: { type: String, default: '' },
  logo: { type: String, default: 'https://via.placeholder.com/50' },
  location: { type: String, required: true },
  stipend: { type: String, required: true },
  duration: { type: String, required: true },
  deadline: { type: Date, required: true },
  category: { type: String, required: true }, // e.g., Engineering, Marketing
  tags: [{ type: String }],
  
  // New Fields
  workType: { type: String, default: 'Full Time' },
  workingDays: { type: String, default: '5 Days/Week' },
  userType: { type: String, default: 'College Student' },
  
  responsibilities: [{ type: String }],
  skills: [{ type: String }],
  optionalSkills: [{ type: String }],
  learning: [{ type: String }],
  
  organizer: {
    name: { type: String, default: 'HR' },
    email: { type: String, default: 'hr@company.com' },
    phone: { type: String, default: '' }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Internship', internshipSchema);
