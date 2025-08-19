
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

const AddTransaction = ({ addTransaction }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate
    if (!formData.description || !formData.amount || !formData.category) {
      setError('Please fill all fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    
    const transactionData = {
      description: formData.description,
      amount: amount,
      category: formData.category,
      type: formData.type,
      date: formData.date
    };

    addTransaction(transactionData);
    
    setSuccess('Transaction added successfully!');
    setTimeout(() => {
      navigate('/transaction');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/transaction')}
            className="mr-4 p-2 hover:bg-gray-800 rounded-full transition"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Add Transaction
            </h1>
            <p className="text-gray-400">Record a new income or expense</p>
          </div>
        </div>

       
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center">
            ✅ {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

      
        <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-6">
          
          {/* Type Toggle */}
          <div className="flex p-1 bg-gray-700 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`px-4 py-2 rounded-md transition ${
                formData.type === 'income'
                  ? 'bg-gradient-to-r from-green-500/30 to-emerald-600/30 text-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💸 Income
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`px-4 py-2 rounded-md transition ${
                formData.type === 'expense'
                  ? 'bg-gradient-to-r from-red-500/30 to-pink-600/30 text-red-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🛒 Expense
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-400 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Select a category</option>
              <optgroup label="Common">
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Shopping">Shopping</option>
                <option value="Rent">Rent</option>
              </optgroup>
              <optgroup label="Income">
                <option value="Salary">Salary</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Other">Other</option>
              </optgroup>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Grocery shopping, Freelance payment"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-400 mb-2">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-400 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={!!success}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 py-3 rounded-md font-medium hover:from-cyan-600 hover:to-purple-700 transition-all disabled:opacity-70"
            >
              {success ? 'Added!' : 'Add Transaction'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/transaction')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>

       
        {success && (
          <div className="text-center mt-8 text-green-400">
            Redirecting to transactions...
          </div>
        )}
      </div>
    </div>
  );
};


const AddTransactionPage = ({ addTransaction }) => {
  return (
    <PrivateRoute>
      <AddTransaction addTransaction={addTransaction} /> {/* ✅ forward it */}
    </PrivateRoute>
  );
};

export default AddTransactionPage;
