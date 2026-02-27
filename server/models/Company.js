const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Primary identifier
  domain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  
  // Basic info
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,  // Clearbit logo URL
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  shortDescription: {
    type: String,
    maxlength: 150,
    default: ''
  },
  
  // Classification
  industry: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  
  // Company details
  headquarters: {
    type: String,
    default: ''
  },
  foundedYear: {
    type: Number,
    default: null
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+', 'Unknown'],
    default: 'Unknown'
  },
  companyType: {
    type: String,
    enum: ['Startup', 'SME', 'Enterprise', 'MNC', 'Government', 'NGO', 'Unknown'],
    default: 'Unknown'
  },
  
  // Contact & Links
  website: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  socials: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },
  
  // Tech stack (from GitHub or job postings)
  techStack: [{
    type: String,
    trim: true
  }],
  
  // GitHub data
  githubData: {
    orgName: { type: String, default: '' },
    publicRepos: { type: Number, default: 0 },
    topLanguages: [{ type: String }],
    totalStars: { type: Number, default: 0 },
    followers: { type: Number, default: 0 }
  },
  
  // Legal/Registry info (from OpenCorporates)
  legalInfo: {
    registrationNumber: { type: String, default: '' },
    jurisdiction: { type: String, default: '' },
    status: { type: String, default: '' }
  },
  
  // Metrics (calculated from our DB)
  metrics: {
    openPositions: { type: Number, default: 0 },
    totalJobsPosted: { type: Number, default: 0 },
    avgSalaryRange: { type: String, default: '' }
  },
  
  // User engagement
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followersCount: {
    type: Number,
    default: 0
  },
  
  // Data source tracking
  dataSources: [{
    source: { type: String },  // 'wikidata', 'opengraph', 'github', 'opencorporates'
    fetchedAt: { type: Date }
  }],
  
  // Cache management
  cachedAt: {
    type: Date,
    default: Date.now
  },
  cacheExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  },
  
  // Verification status
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
companySchema.index({ name: 'text', industry: 'text', tags: 'text' });

// Check if cache is stale
companySchema.methods.isCacheStale = function() {
  return new Date() > this.cacheExpiry;
};

// Update cache expiry
companySchema.methods.refreshCache = function(ttlHours = 168) { // 7 days default
  this.cachedAt = new Date();
  this.cacheExpiry = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
};

// Static method to find by domain or create placeholder
companySchema.statics.findOrCreateByDomain = async function(domain, name) {
  let company = await this.findOne({ domain: domain.toLowerCase() });
  
  if (!company) {
    company = new this({
      domain: domain.toLowerCase(),
      name: name || domain.split('.')[0],
      logo: `https://logo.clearbit.com/${domain}`
    });
    await company.save();
  }
  
  return company;
};

module.exports = mongoose.model('Company', companySchema);
