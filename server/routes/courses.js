const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new course
router.post('/', async (req, res) => {
  const course = new Course({
    title: req.body.title,
    instructor: req.body.instructor,
    instructorBio: req.body.instructorBio,
    instructorAvatar: req.body.instructorAvatar,
    thumbnail: req.body.thumbnail,
    price: req.body.price,
    originalPrice: req.body.originalPrice,
    rating: req.body.rating,
    reviewCount: req.body.reviewCount,
    duration: req.body.duration,
    category: req.body.category,
    level: req.body.level,
    language: req.body.language,
    description: req.body.description,
    learnings: req.body.learnings,
    curriculum: req.body.curriculum,
    requirements: req.body.requirements,
    features: req.body.features,
    tags: req.body.tags,
    enrolledCount: req.body.enrolledCount
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST enroll in course
router.post('/:id/enroll', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $inc: { enrolledCount: 1 } },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Enrolled successfully', enrolledCount: course.enrolledCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
