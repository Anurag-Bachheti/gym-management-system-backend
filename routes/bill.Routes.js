const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Bill = require('../models/Bill');
const {getAllBill} = require('../controllers/billController');

router.get('/', getAllBill, authenticateToken, async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error });
  }
});

router.get('/bill-receipt', authenticateToken, async (req, res) => {
  try {
    const memberEmail = req.user.email;
    const bill = await Bill.findOne({ email: memberEmail });

    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ message: 'Bill not created' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bill receipt', error });
  }
});


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