const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  membershipStatus: { type: String, enum: ['active', 'inactive'], required: true, default: "active" },
  membershipType: { type: String, enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'], required: true, default: "Monthly" },
  amountPaid: { type: String, enum: ['yes', 'no'], required: true, default: "no" },
  nextPaymentDate: { type: Date, required: true }, // Adding the required next payment date
  createdAt: { type: Date, default: Date.now },
  reminderSent: { type: Boolean, default: false }, // Adding the reminderSent field
});

const User = mongoose.model('User', userSchema);

module.exports = User;
