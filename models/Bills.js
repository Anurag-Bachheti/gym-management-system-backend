const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection
    required: true,
  },
  membershipType: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Yearly'], // Allowed types
    required: true,
  },
  amountpaid: {
    type: Number,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid',
  },
});

module.exports = mongoose.model('Bill', billSchema);
