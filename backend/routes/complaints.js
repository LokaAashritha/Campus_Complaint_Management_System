const express = require('express');
const router = express.Router();

// Get all complaints
router.get('/', (req, res) => {
  res.json({ message: 'Complaints list API working' });
});

// Add complaint
router.post('/', (req, res) => {
  res.json({ message: 'Complaint submitted successfully' });
});

module.exports = router;
