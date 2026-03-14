const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Complaint = require('../models/Complaint');

/* Create complaint (Student only) */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const complaint = new Complaint({
      title,
      description,
      category,
      user: req.user._id
    });

    await complaint.save();

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create complaint' });
  }
});

/* Get logged-in user's complaints */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate('category', 'name');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
});

module.exports = router;