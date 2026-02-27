const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorAvatar: { type: String, default: '' },
  authorBio: { type: String, default: '' },
  image: { type: String, default: '/images/blog-placeholder.jpg' },
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

blogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
