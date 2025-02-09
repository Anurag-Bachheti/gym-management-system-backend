const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
// const bcrypt = require("bcrypt");

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


// router.post("/api/add-member", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Hash password before storing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newMember = new User({
//       email,
//       password: hashedPassword,
//       role: "member",
//     });

//     await newMember.save();
//     res.status(201).json({ message: "Member added successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding member" });
//   }
// });

module.exports = router;