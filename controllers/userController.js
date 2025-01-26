const User = require('../models/User');

// Create a new user with sequential ID
exports.createUser = async (req, res) => {
  try {
    const { name, phone, email, nextPaymentDate, membershipType, amountpaid } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !nextPaymentDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    const lastUser = await User.findOne().sort({ _id: -1 });

    const newId = lastUser ? lastUser._id + 1 : 1;

    const user = await User.create({ 
      name,
      phone,
      email,
      nextPaymentDate,
      membershipType: membershipType || "Unknown",
      amountpaid: amountpaid || "no",
      reminderSent: false,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete all users
exports.deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany(); // Deletes all users
    res.status(200).json({ message: 'All users deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};