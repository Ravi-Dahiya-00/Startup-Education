const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Test Route
router.get('/test', (req, res) => {
  res.json({ status: 'Backend is reachable' });
});

// Strict Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

// Register
router.post('/register', authLimiter, async (req, res) => {
  const { name, email, password, username, role } = req.body;

  try {
    // Validate username format
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        message: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' 
      });
    }

    // Check if email exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if username exists
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password with stronger work factor (12 rounds)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      username,
      role: role || 'student'
    });

    await user.save();

    // Create token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, username: user.username } });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Create token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        username: user.username || null,
        avatar: user.avatar || null
      } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Google Login
router.post('/google', async (req, res) => {
  const { token: googleIdToken, username } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleIdToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { name, email, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      // Existing user - log them in
      user.googleId = sub;
      user.avatar = picture;
      await user.save();
    } else {
      // New user - check if username is provided
      if (!username) {
        // Return pending status - frontend needs to collect username
        return res.json({ 
          pending: true, 
          tempData: { name, email, picture, googleId: sub },
          message: 'Please choose a username to complete signup'
        });
      }

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ 
          message: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' 
        });
      }

      // Check if username exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      // Create new user with provided username
      user = new User({
        name,
        email,
        googleId: sub,
        avatar: picture,
        username,
        password: '' // No password for Google users
      });
      await user.save();
    }

    // Create token for logged in user
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    console.log('Google login attempt for email:', email);
    console.log('User found:', !!user);

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, username: user.username } });
  } catch (err) {
    console.error('Google Auth Error Full:', err);
    res.status(500).json({ 
      message: 'Google Login Server Error', 
      error: err.message,
      details: err.errors ? Object.keys(err.errors).map(k => err.errors[k].message) : null
    });
  }
});

module.exports = router;
