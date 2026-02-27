const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  instructorBio: { type: String, default: '' },
  instructorAvatar: { type: String, default: '' },
  thumbnail: { type: String, default: 'https://via.placeholder.com/300x200' },
  price: { type: String, required: true }, // e.g. Free or ₹499
  originalPrice: { type: String, default: '' }, // For showing discounts
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  duration: { type: String, required: true }, // e.g. 10 Hours
  category: { type: String, required: true }, // Development, Design
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  language: { type: String, default: 'English' },
  description: { type: String, default: '' },
  
  // What you'll learn
  learnings: [{ type: String }],
  
  // Course curriculum/syllabus
  curriculum: [{
    sectionTitle: { type: String },
    lessons: [{
      title: { type: String },
      duration: { type: String },
      isPreview: { type: Boolean, default: false }
    }]
  }],
  
  // Requirements
  requirements: [{ type: String }],
  
  // Course features
  features: {
    totalLessons: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    hasQuizzes: { type: Boolean, default: false },
    hasCertificate: { type: Boolean, default: true },
    hasLifetimeAccess: { type: Boolean, default: true }
  },
  
  tags: [{ type: String }],
  enrolledCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);
