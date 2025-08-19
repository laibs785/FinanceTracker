// routes/budgets.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/auth');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const router = express.Router();

// ✅ GET /api/budgets - Get all budgets with spent & progress
router.get('/', protect, asyncHandler(async (req, res) => {
  // 1. Get all user's budgets
  const budgets = await Budget.find({ user: req.user._id }).lean();

  // 2. Get all user's transactions (only expenses)
  const transactions = await Transaction.find({
    user: req.user._id,
    type: 'expense',
  }).lean();

  // 3. For each budget, calculate total spent in that category
  const enrichedBudgets = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const progress = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

    return {
      ...budget,
      spent: parseFloat(spent.toFixed(2)),
      progress: parseFloat(progress.toFixed(2)), // e.g., 82.34%
    };
  });

  res.json(enrichedBudgets);
}));

// ✅ POST /api/budgets - Create new budget

router.post('/', protect, asyncHandler(async (req, res) => {
  const { category, limit } = req.body;

  if (!category || !limit) {
    res.status(400);
    throw new Error('Please provide category and limit');
  }

  if (limit <= 0) {
    res.status(400);
    throw new Error('Limit must be greater than 0');
  }

  const existingBudget = await Budget.findOne({ user: req.user._id, category });
  if (existingBudget) {
    res.status(400);
    throw new Error(`A budget for '${category}' already exists. Please edit it instead.`);
  }

  const budget = await Budget.create({
    user: req.user._id,
    category,
    limit,
  });

  // ✅ Now enrich it with spent & progress (same as GET)
  const transactions = await Transaction.find({
    user: req.user._id,
    type: 'expense',
    category
  });

  const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const progress = limit > 0 ? (spent / limit) * 100 : 0;

  // ✅ Send enriched response
  res.status(201).json({
    ...budget.toObject(),
    spent: parseFloat(spent.toFixed(2)),
    progress: parseFloat(progress.toFixed(2))
  });
}));

// ✅ PUT /api/budgets/:id - Update budget limit
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const { limit } = req.body;
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  // Check if user owns this budget
  if (budget.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (limit <= 0) {
    res.status(400);
    throw new Error('Limit must be greater than 0');
  }

  budget.limit = limit;
  await budget.save();

  res.json(budget);
}));

// ✅ DELETE /api/budgets/:id
// ✅ Corrected DELETE route
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  if (budget.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // ✅ Use deleteOne() instead of remove()
  await budget.deleteOne();

  res.json({ message: 'Budget removed' });
}));
module.exports = router;