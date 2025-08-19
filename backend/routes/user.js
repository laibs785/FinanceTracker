// routes/user.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 🔐 GET /api/users/profile - Get full profile + stats
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  // Get transactions
  const transactions = await Transaction.find({ user: req.user._id });
  const categories = new Set(transactions.map(t => t.category));

  // Get active budgets (progress < 100)
  const budgets = await Budget.find({ user: req.user._id }).lean();
  const activeBudgets = budgets.filter(b => {
    const spent = transactions
      .filter(t => t.category === b.category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return (spent / b.limit) * 100 < 100;
  }).length;

  res.json({
    user,
    stats: {
      totalTransactions: transactions.length,
      categoriesUsed: categories.size,
      activeBudgets
    }
  });
}));

// 🔐 PUT /api/users/profile - Update profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const { name, currency, notification, biometric } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = name || user.username;
    user.currency = currency || user.currency;
    user.settings = {
      ...user.settings,
      emailNotifications: notification,
      biometricLogin: biometric,
    };

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      currency: updatedUser.currency,
      settings: updatedUser.settings
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// 🔐 PUT /api/users/password - Change password
router.put('/password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();
  res.json({ message: 'Password updated successfully' });
}));

// 🔐 POST /api/users/export - Export data as CSV
router.post('/export', protect, asyncHandler(async (req, res) => {
  const { format = 'csv' } = req.body;
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: 1 });

  if (format === 'csv') {
    let csv = 'Date,Description,Category,Type,Amount\n';
    transactions.forEach(t => {
      csv += `${t.date},${t.description},${t.category},${t.type},${t.amount}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`transactions-${new Date().toISOString().slice(0, 7)}.csv`);
    return res.send(csv);
  }

  res.status(400).json({ error: 'Unsupported format' });
}));

// 🔐 DELETE /api/users/account - Delete user and all data
router.delete('/account', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Delete all user data
  await User.deleteOne({ _id: req.user._id });
  await Transaction.deleteMany({ user: req.user._id });
  await Budget.deleteMany({ user: req.user._id });

  // Clear token
  res.json({ message: 'Account deleted successfully' });
}));

module.exports = router;