const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  plan: { type: String, required: true },
  contact: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Member', MemberSchema);