const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming you're using the User model for both "members" and "users"
const userController = require('../controllers/userController');

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// Login route (No change here)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST route to add a new member (uses the User model)
router.post('/members', async (req, res) => {
  try {
    const { name, email, phone, membershipStatus, membershipType, createdAt } = req.body;

    // Validate input data
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const newMember = new User({
      name,
      email,
      phone,
      membershipStatus,
      membershipType,
      createdAt,
    });

    await newMember.save();

    res.status(201).json(newMember);
  } catch (err) {
    console.error("Error adding member:", err);
    res.status(500).json({ message: 'Error adding member' });
  }
});

// GET route to fetch all members (or users)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 }); // Sort alphabetically
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});


// Generic route handling (could be used for other user actions, but doesn't seem to be necessary right now)
router.route('/').get(getUsers).post(createUser).delete(userController.deleteAllUsers);
router.route('/:id').get(getUserById).put(updateUser).delete();

module.exports = router;