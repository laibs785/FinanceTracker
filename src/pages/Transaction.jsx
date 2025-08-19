
import React, { useState, useRef } from 'react';
import {
  FiDollarSign,
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiPlusCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiShoppingBag,
  FiHome,
  FiCoffee,
  FiAlertCircle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

//  category icons 
const categoryIcons = {
  Food: <FiCoffee className="text-yellow-400" />,
  Entertainment: <FiCoffee className="text-orange-400" />,
  Utilities: <FiHome className="text-blue-400" />,
  Income: <FiDollarSign className="text-green-400" />,
  Finance: <FiCreditCard className="text-purple-400" />,
  Shopping: <FiShoppingBag className="text-red-400" />,
  Rent: <FiHome className="text-indigo-400" />,
  Transport: <FiCreditCard className="text-cyan-400" />,
  Medical: <FiCreditCard className="text-red-400" />,
  Education: <FiCreditCard className="text-blue-400" />,
  Travel: <FiCreditCard className="text-green-400" />,
  Freelancing: <FiDollarSign className="text-green-400" />,
  Salary: <FiDollarSign className="text-emerald-400" />,
  Other: <FiCreditCard className="text-gray-400" />,
};

const TransactionsPage = ({ transactions: propTransactions, updateTransaction, deleteTransaction }) => {
  const [loading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const descriptionInputRef = useRef(null);
  const transactions = propTransactions || [];

  // Start editing
  const startEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditData({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date.split('T')[0],
      type: transaction.type,
    });
    setError('');
    setTimeout(() => {
      descriptionInputRef.current?.focus();
    }, 0);
  };

  // Save edit
  const saveEdit = async () => {
    setError('');

    if (!editData.description || !editData.amount || !editData.category || !editData.date || !editData.type) {
      return setError('All fields are required');
    }

    const amount = parseFloat(editData.amount);
    if (isNaN(amount) || amount <= 0) {
      return setError('Amount must be a valid positive number');
    }

    setSaving(true);

    try {
      updateTransaction(editingId, { ...editData, amount });
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setError('Failed to update transaction');
    } finally {
      setSaving(false);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setError('');
  };

  // Delete transaction
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      deleteTransaction(id);
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  // Filter transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesFilter = activeFilter === 'all' || transaction.type === activeFilter;
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 pt-16">
      {/* Header */}
       
      <div className="max-w-7xl mx-auto mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-20 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Transactions
            </h1>
            <p className="text-gray-400">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <button
            onClick={() => navigate("/add-transaction")}
            className="mt-4 sm:mt-0 flex items-center justify-center sm:justify-start px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-cyan-500/25"
          >
            <FiPlus className="mr-2" /> Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Balance"
          value={`₹${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<FiDollarSign />}
          color="from-cyan-500/20 to-blue-600/20"
          subText={
            <>
              <span className="text-green-400">+₹{totalIncome.toLocaleString()}</span> •{' '}
              <span className="text-red-400">-₹{totalExpenses.toLocaleString()}</span>
            </>
          }
        />
        <SummaryCard
          title="Income"
          value={`+₹${totalIncome.toLocaleString()}`}
          icon={<FiTrendingUp />}
          color="from-green-500/20 to-emerald-600/20"
          subText="This month"
        />
        <SummaryCard
          title="Expenses"
          value={`-₹${totalExpenses.toLocaleString()}`}
          icon={<FiTrendingDown />}
          color="from-red-500/20 to-pink-600/20"
          subText="This month"
        />
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                { key: 'all', label: 'All', color: 'from-cyan-500/20 to-purple-500/20' },
                { key: 'income', label: 'Income', color: 'from-green-500/20 to-emerald-600/20' },
                { key: 'expense', label: 'Expenses', color: 'from-red-500/20 to-pink-600/20' },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    activeFilter === key
                      ? `bg-gradient-to-r ${color} text-cyan-400 border border-cyan-400/30`
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* Desktop: Table Header */}
          <div className="hidden md:grid md:grid-cols-12 bg-gray-700/50 px-6 py-4 border-b border-gray-700 text-gray-400 font-medium">
            <div className="col-span-1"></div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              icon={<FiPlusCircle className="text-gray-500" />}
              title="No Transactions Yet"
              message="Get started by adding your first transaction"
              action={() => navigate('/add-transaction')}
            />
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <React.Fragment key={transaction._id}>
                {editingId === transaction._id ? (
                  // ✏️ Edit Mode
                  <div className="grid grid-cols-12 px-6 py-5 bg-gray-700/30 border-b border-gray-700/50 last:border-0 md:grid">
                    <div className="col-span-1 flex justify-center text-2xl">
                      {categoryIcons[transaction.category] || <FiCreditCard className="text-gray-400" />}
                    </div>
                    <div className="col-span-4 mb-3 md:mb-0">
                      <input
                        ref={descriptionInputRef}
                        type="text"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-2 mb-3 md:mb-0">
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none text-white"
                      >
                        {Object.keys(categoryIcons).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 mb-3 md:mb-0">
                      <input
                        type="date"
                        value={editData.date}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none text-white"
                      />
                    </div>
                    <div className="col-span-2 mb-3 md:mb-0">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none text-right text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end space-x-3">
                      <button
                        onClick={saveEdit}
                        disabled={saving}
                        className="p-2 text-green-400 hover:text-green-300 disabled:opacity-50"
                        title="Save"
                      >
                        <FiCheck size={20} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-400 hover:text-white"
                        title="Cancel"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                 
                  <div className="md:grid md:grid-cols-12 px-6 py-5 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30 transition-colors">
                    {/* Mobile Card */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">
                            {categoryIcons[transaction.category] || <FiCreditCard className="text-gray-400" />}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{transaction.description}</p>
                            <p className="text-sm text-gray-400">{transaction.category}</p>
                          </div>
                        </div>
                        <span className={`font-bold text-lg ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => startEdit(transaction)}
                          className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="text-red-400 hover:text-red-300 font-medium text-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Desktop Row */}
                    <div className="hidden md:flex md:col-span-1 justify-center text-2xl">
                      {categoryIcons[transaction.category] || <FiCreditCard className="text-gray-400" />}
                    </div>
                    <div className="hidden md:flex md:col-span-4 items-center">
                      <p className="font-semibold text-white">{transaction.description}</p>
                    </div>
                    <div className="hidden md:flex md:col-span-2">
                      <span className="px-3 py-1.5 text-sm bg-gray-700 rounded-full">
                        {transaction.category}
                      </span>
                    </div>
                    <div className="hidden md:flex md:col-span-2 text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                    <div className={`hidden md:flex md:col-span-2 justify-end font-bold text-lg ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="hidden md:flex md:col-span-1 justify-end space-x-3">
                      <button
                        onClick={() => startEdit(transaction)}
                        className="p-2 text-cyan-400 hover:text-cyan-300 transition"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="p-2 text-red-400 hover:text-red-300 transition"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400">
              <FiSearch className="mx-auto text-4xl mb-3 opacity-60" />
              <p className="text-lg">No transactions match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const SummaryCard = ({ title, value, icon, color, subText }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        <p className="text-sm text-gray-400 mt-2">{subText}</p>
      </div>
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition`}>
        {icon}
      </div>
    </div>
  </div>
);

const EmptyState = ({ icon, title, message, action }) => (
  <div className="text-center py-16 px-6">
    <div className="inline-flex p-4 rounded-full bg-gray-800/50 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6">{message}</p>
    <button
      onClick={action}
      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all font-medium"
    >
      Add Your First Transaction
    </button>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"></div>
      <p className="text-gray-400">Loading transactions...</p>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
      <FiAlertCircle className="text-red-400 mx-auto text-3xl mb-2" />
      <p className="text-red-400">{message}</p>
    </div>
  </div>
);

export default TransactionsPage;