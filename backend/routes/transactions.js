// routes/transactions.js

const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const router = express.Router();

// ✅ GET /api/transactions - Get all user's transactions
router.get('/', protect, asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ date: -1 })
    .lean();

  res.json(transactions);
}));

// ✅ POST /api/transactions - Add new transaction
router.post('/', protect, asyncHandler(async (req, res) => {
  const { description, amount, category, type, date } = req.body;

  if (!description || !amount || !category || !type) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  if (!['income', 'expense'].includes(type)) {
    res.status(400);
    throw new Error('Type must be "income" or "expense"');
  }

  const transaction = await Transaction.create({
    user: req.user._id,
    description,
    amount,
    category,
    type,
    date: date || Date.now(),
  });

  res.status(201).json(transaction);
}));

// ✅ PUT /api/transactions/:id - Update transaction
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description, amount, category, type, date } = req.body;

  // Validate input
  if (!description || !amount || !category || !type) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  if (!['income', 'expense'].includes(type)) {
    res.status(400);
    throw new Error('Type must be "income" or "expense"');
  }

  const transaction = await Transaction.findOne({ _id: id, user: req.user._id });

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Update fields
  transaction.description = description;
  transaction.amount = amount;
  transaction.category = category;
  transaction.type = type;
  transaction.date = date;

  const updatedTransaction = await transaction.save();
  res.json(updatedTransaction);
}));

// ✅ DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  res.json({ message: 'Transaction deleted successfully' });
}));

module.exports = router;