const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Computer Science"
  code: { type: String, required: true }, // e.g., "CSE"
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Branch', branchSchema);
