const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: { type: String, required: true }, // e.g. Google, Microsoft
  logo: { type: String, default: 'https://via.placeholder.com/50' },
  mode: { type: String, required: true }, // Online/Offline
  prizes: { type: String, required: true }, // e.g. ₹50,000
  deadline: { type: String, required: true },
  category: { type: String, required: true }, // Coding, Design, etc.
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Competition', competitionSchema);
