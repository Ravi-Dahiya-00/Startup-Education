const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  aliases: [{ type: String }], // Shortcuts like "CU", "IITD"
  location: { type: String },
  logo: { type: String }, // URL to logo
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('University', universitySchema);
