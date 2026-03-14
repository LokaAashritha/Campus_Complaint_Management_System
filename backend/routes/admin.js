const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const Complaint = require('../models/Complaint');

/* Test route */
router.get('/test', (req, res) => {
  res.json({ message: 'Admin route working' });
});

/* Get all complaints (Admin only) */
router.get('/complaints', authMiddleware, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate('category', 'name');

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
});

/* Update complaint status (Admin only) */
router.put('/complaints/:id/status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

module.exports = router;