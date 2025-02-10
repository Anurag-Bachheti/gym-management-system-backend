const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Bill = require('../models/Bill');

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Password not set. Contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.membershipStatus !== 'active') {
      return res.status(403).json({ message: 'Unauthorized: Membership inactive' });
    }

    const token = jwt.sign({ userId: user._id, role: 'member' }, 'yourSecretKey', { expiresIn: '1h' });
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "member",
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST route to add a new member
router.post('/users', async (req, res) => {
  try {
    const { name, email, phone, password, membershipStatus = 'active', membershipType = 'Monthly' } = req.body;

    // Validate input data
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Name, email, phone and password are required.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving

    const newMember = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      membershipStatus,
      membershipType,
      amountPaid: 'no',
    });

    await newMember.save();
    res.status(201).json({ message: 'Member added successfully', user: newMember });
  } catch (err) {
    console.error("Error adding member:", err);
    res.status(500).json({ message: 'Error adding member', error: err.message || err });
  }
});

// GET route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 }); // Sort alphabetically
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});



router.post("/add-member", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the member already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = new User({
      name,
      email,
      password: hashedPassword,
      membershipStatus: "active", // Ensure it's active by default
      role: "member",
    });

    await newMember.save();
    res.status(201).json({ message: "Member added successfully" });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// GET route to fetch user by ID
router.put('/users/:id', async (req, res) => {
  const { id } = req.params; // Extract user ID from URL parameters
  const updates = req.body;  // Extract the fields to be updated from the request body

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use the update() method to update the user's fields
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    // Return the updated user details
    res.status(200).json(updatedUser);

  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

// PUT route to update a user
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Validate the update fields
  const allowedUpdates = ['name', 'email', 'phone', 'membershipStatus', 'membershipType'];
  const updatesKeys = Object.keys(updates);
  const isValidUpdate = updatesKeys.every((key) => allowedUpdates.includes(key));

  if (!isValidUpdate) {
    return res.status(400).json({ message: 'Invalid update fields' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

//Fetch all bills
router.get('/all-bills', async (req, res) => {
  try {
    const bills = await Bill.find(); // Fetch all bills from the database
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error });
  }
});


// DELETE route to delete a user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;