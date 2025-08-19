// routes/dashboard.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const router = express.Router();

// GET /api/dashboard - Full dashboard data
router.get('/', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all transactions
  const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });

  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  // Top Category
  const categorySpending = {};
  expenses.forEach(t => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
  });
  const topCategory = Object.keys(categorySpending).reduce((a, b) => 
    categorySpending[a] > categorySpending[b] ? a : b, ''
  );

  // Monthly Overview (last 6 months)
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  const monthlyData = Array(6).fill().map((_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthStr = month.toLocaleString('default', { month: 'short' });

    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= new Date(now.getFullYear(), now.getMonth() - (5 - i), 1) &&
             tDate < new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
    });

    const inc = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const exp = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { month: monthStr, income: inc, expenses: exp };
  });

  // Top Budgets
  const budgets = await Budget.find({ user: userId });
  const enrichedBudgets = budgets.map(budget => {
    const spent = expenses
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const progress = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

    return {
      ...budget.toObject(),
      spent: parseFloat(spent.toFixed(2)),
      progress: parseFloat(progress.toFixed(2)),
    };
  }).sort((a, b) => b.progress - a.progress).slice(0, 3);

  // Upcoming Bills (example: transactions with "Bill" in description)
  const upcomingBills = transactions
    .filter(t => t.description.toLowerCase().includes('bill') && t.type === 'expense')
    .slice(0, 3);

  res.json({
    totalIncome,
    totalExpenses,
    totalBalance,
    topCategory: topCategory || 'N/A',
    categorySpending,
    monthlyData,
    topBudgets: enrichedBudgets,
    recentTransactions: transactions.slice(0, 5),
    upcomingBills
  });
}));

module.exports = router;