const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  assignedTo: {
    type: String // staff name or department
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
