const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Data Structures"
  code: { type: String, required: true }, // e.g., "18CS32"
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', subjectSchema);
