const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  membershipStatus: { type: String, enum: ['active', 'inactive'], required: true, default: "active" },
  membershipType: { type: String, enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'], required: true, default: "Monthly" },
  amountpaid: { type: String, enum: ['yes', 'no'], required: true, default: "no" },
  nextPaymentDate: { type: Date, required: true, default: () => new Date(new Date().setMonth(new Date().getMonth() + 1)) }, // Set default to one month from now
  createdAt: { type: Date, default: Date.now },
  reminderSent: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
module.exports = User;