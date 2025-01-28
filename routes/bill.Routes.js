const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Bill = require('../models/Bill');

router.post('/create', async (req, res) => {
  const { userId, membershipType, amountpaid, dueDate } = req.body;

  // Validation
  if (!userId || !membershipType || !amountpaid || !dueDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }


  try {
    const newBill = new Bill({
      userId,
      membershipType,
      amountpaid,
      dueDate,
    });
    await newBill.save();
    res.status(201).json({ message: 'Bill created successfully', bill: newBill });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;