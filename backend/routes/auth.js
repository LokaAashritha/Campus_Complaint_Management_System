const express = require('express');
const router = express.Router();

// Student/Admin Register (temporary)
router.post('/register', (req, res) => {
  res.json({ message: 'Register API working' });
});

// Login
router.post('/login', (req, res) => {
  res.json({ message: 'Login API working' });
});

module.exports = router;
