const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// Routes
router.post('/', billController.createBill); // Create a bill
router.get('/', billController.getAllBills); // Get all bills
router.get('/user/:userId', billController.getBillsByUser); // Get bills for a specific user
router.put('/:billId', billController.updateBillStatus); // Update a bill's status

module.exports = router;