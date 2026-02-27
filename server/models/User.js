const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google Auth users
  googleId: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['student', 'teacher', 'other', 'admin'], default: 'student' },
  
  // Profile Fields
  username: { type: String, unique: true, sparse: true },
  usernameChangeCount: { type: Number, default: 0 },
  institution: { type: String },
  branch: { type: String },
  batch: { type: String },
  semester: { type: Number },
  subjects: [{ type: String }],
  skills: [{ type: String }],
  bio: { type: String, maxLength: 250 },
  phoneNumber: { type: String },
  
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    website: { type: String }
  },
  
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    profileVisibility: { type: String, enum: ['public', 'community', 'private'], default: 'public' }
  },
  
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
