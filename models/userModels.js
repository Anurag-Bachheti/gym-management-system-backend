const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  membershipStatus: { type: String, enum: ['active', 'inactive'], required: true },
  membershipType: { type: String, required: true }, // e.g., Monthly, Annual
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
    