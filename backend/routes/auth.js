const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// =======================
// REGISTER
// =======================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let resolvedRole = 'student';

    if (role === 'admin') {
      const expectedSecret = process.env.ADMIN_REGISTRATION_SECRET;

      if (!expectedSecret || adminSecret !== expectedSecret) {
        return res.status(403).json({ message: 'Admin registration is not allowed' });
      }

      resolvedRole = 'admin';
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: resolvedRole
    });

    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('REGISTER ERROR:', error);
    return res.status(500).json({ message: 'Register failed', error: error.message });
  }
});

// =======================
// LOGIN
// =======================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;