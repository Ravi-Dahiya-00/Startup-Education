const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  
  // Relations
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if anonymous allowed, but better with user
  
  // Metadata
  semester: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Notes', 'PPT', 'PYQ', 'Lab Manual', 'Assignment', 'Syllabus', 'E-Book', 'Other'],
    default: 'Notes'
  },
  unit: { type: String }, // e.g. "Unit 1", "Module 2"
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  isVerified: { type: Boolean, default: false },
  tags: [{ type: String }],
  
  // File Info
  fileUrl: { type: String, required: true },
  fileType: { type: String }, // pdf, docx, jpg
  fileSize: { type: String }, // e.g., "2.5 MB"
  pageCount: { type: Number }, // Extracted metadata
  
  // Interaction Stats
  downloads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  popularityScore: { type: Number, default: 0 }, // downloads + likes * 2
  
  likedBy: [{ type: String }], // User IDs or IPs
  downloadedBy: [{ type: String }], // User IDs or IPs
  
  // Versioning
  version: { type: Number, default: 1 },
  isLatest: { type: Boolean, default: true },
  parentNote: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' }, // If this is a new version of an old note

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
