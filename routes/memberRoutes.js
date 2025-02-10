const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const authenticateToken = require('../middleware/authMiddleware');

// Fetch all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find({}, 'id name'); // Return only id and name
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members' });
  }
});

// Fetch a specific member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member)return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member details' });
  }
});

router.get('/bill-receipt', authenticateToken, async (req, res) => {
  try {
    const memberEmail = req.user.email; // Assuming the token contains the user's email
    const bill = await Bill.findOne({ email: memberEmail }); // Find the bill by member's email

    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ message: 'Bill not created' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bill receipt', error });
  }
});

module.exports = router;