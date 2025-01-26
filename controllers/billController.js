const Bill = require('../models/Bills');

// Create a new bill
exports.createBill = async (req, res) => {
  try {
    const { userId, membershipType, amount, dueDate } = req.body;

    const newBill = await Bill.create({
      userId,
      membershipType,
      amount,
      dueDate,
    });

    res.status(201).json(newBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate('userId', 'name email'); // Populate user info
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bills for a specific user
exports.getBillsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bills = await Bill.find({ userId }).populate('userId', 'name email');
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a bill's status
exports.updateBillStatus = async (req, res) => {
  try {
    const { billId } = req.params;
    const { status } = req.body;

    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      { status },
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json(updatedBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};