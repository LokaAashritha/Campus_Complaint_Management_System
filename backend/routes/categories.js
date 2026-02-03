const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// ➕ Add a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📄 Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;   // 🔴 VERY IMPORTANT
