const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new blog
router.post('/', async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    excerpt: req.body.excerpt,
    content: req.body.content,
    author: req.body.author,
    authorAvatar: req.body.authorAvatar,
    authorBio: req.body.authorBio,
    image: req.body.image,
    category: req.body.category,
    readTime: req.body.readTime,
    tags: req.body.tags
  });

  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update blog
router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST like blog
router.post('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ likes: blog.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
