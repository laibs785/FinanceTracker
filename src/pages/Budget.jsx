import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash,
  FiPlus,
  FiAlertTriangle,
  FiPieChart,
  FiActivity,
  FiDollarSign,
  FiCoffee,
  FiWifi,
  FiShoppingBag,
  FiHome,
  FiX,
  FiTrendingUp
} from "react-icons/fi";
import { MdOutlineFastfood, MdOutlineDirectionsCar } from "react-icons/md";
import API from "../api/api";
import PrivateRoute from "../components/PrivateRoute";

const BudgetPageContent = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [newBudget, setNewBudget] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    period: "monthly",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await API.get("/budgets");
        setBudgets(response.data);
      } catch (err) {
        console.error("Error fetching budgets:", err);
        setPageError("Failed to load budgets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const refreshBudgets = async () => {
    try {
      const response = await API.get("/budgets");
      setBudgets(response.data);
    } catch (err) {
      console.error("Failed to refresh budgets:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Filter budgets
  const filteredBudgets = budgets.filter((budget) => {
    if (activeTab === "all") return true;
    if (activeTab === "exceeded") return budget.progress > 100;
    if (activeTab === "completed") return budget.progress === 100;
    return budget.progress < 100; // active
  });

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.category || !formData.limit) {
      return setFormError("Please fill all fields");
    }
    if (parseFloat(formData.limit) <= 0) {
      return setFormError("Limit must be greater than zero");
    }

    try {
      if (editingId) {
        await API.put(`/budgets/${editingId}`, {
          category: formData.category,
          limit: parseFloat(formData.limit),
          period: formData.period,
        });
      } else {
        await API.post("/budgets", {
          category: formData.category,
          limit: parseFloat(formData.limit),
          period: formData.period,
        });
      }

      await refreshBudgets();
      setNewBudget(false);
      setFormData({ category: "", limit: "", period: "monthly" });
      setEditingId(null);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save budget";

      if (errorMsg.toLowerCase().includes("already exists")) {
        setFormError(errorMsg);
      } else {
        setFormError('Something went wrong: ' + errorMsg);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      await API.delete(`/budgets/${id}`);
      await refreshBudgets();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete budget";
      setFormError(errorMsg);
    }
  };

  const handleEdit = (budget) => {
    setFormData({
      category: budget.category,
      limit: budget.limit,
      period: budget.period || "monthly",
    });
    setNewBudget(true);
    setEditingId(budget._id);
  };

  // Get progress bar color
  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-gradient-to-r from-red-500 to-red-600";
    if (percentage >= 80) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
    return "bg-gradient-to-r from-green-500 to-green-600";
  };

  const getBudgetIcon = (category) => {
    const iconProps = "w-5 h-5";
    switch (category) {
      case "Food": return <MdOutlineFastfood className={`${iconProps} text-red-400`} />;
      case "Transport": return <MdOutlineDirectionsCar className={`${iconProps} text-blue-400`} />;
      case "Entertainment": return <FiCoffee className={`${iconProps} text-yellow-400`} />;
      case "Utilities": return <FiWifi className={`${iconProps} text-purple-400`} />;
      case "Shopping": return <FiShoppingBag className={`${iconProps} text-pink-400`} />;
      case "Rent": return <FiHome className={`${iconProps} text-cyan-400`} />;
      default: return <FiActivity className={`${iconProps} text-gray-400`} />;
    }
  };

  if (loading) return <LoadingState />;
  if (pageError) return <ErrorState message={pageError} />;

  // Stats
  const activeBudgets = filteredBudgets.length;
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-4 sm:p-6 pt-20">
  {/* Header with prominent CTA */}
  
          
      <div className="max-w-7xl mx-auto mb-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-14">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Budget Management
            </h1>
            <p className="text-gray-400 mt-1">Track and grow your financial health</p>
          </div>

          {/* Enhanced Desktop Button */}
          <button
            onClick={() => {
              setNewBudget(true);
              setFormError("");
              setEditingId(null);
              setFormData({ category: "", limit: "", period: "monthly" });
            }}
            className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all shadow-xl hover:shadow-cyan-500/40 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 min-w-fit whitespace-nowrap animate-pulse-once"
          >
            <div className="p-1.5 bg-white/20 rounded-lg">
              <FiPlus className="w-5 h-5" />
            </div>
            Create Budget
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Active Budgets"
          value={activeBudgets}
          icon={<FiActivity className="text-cyan-400" />}
          color="from-cyan-500/20 to-blue-600/20"
        />
        <StatCard
          title="Total Budget"
          value={`$${totalBudget.toLocaleString()}`}
          icon={<FiDollarSign className="text-purple-400" />}
          color="from-purple-500/20 to-pink-600/20"
        />
        <StatCard
          title="Total Spent"
          value={`$${totalSpent.toLocaleString()}`}
          icon={<FiPieChart className="text-green-400" />}
          color="from-emerald-500/20 to-teal-600/20"
        />
        
      </div>
      

      {/* Filters and Create Button for Medium Screens */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-stretch">
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 backdrop-blur-sm flex-grow">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { key: "all", label: "All Budgets", color: "from-cyan-500/20 to-purple-500/20" },
              { key: "active", label: "Active", color: "from-green-500/20 to-emerald-600/20" },
              { key: "exceeded", label: "Exceeded", color: "from-red-500/20 to-pink-600/20" },
              { key: "completed", label: "Completed", color: "from-yellow-500/20 to-orange-600/20" },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
                  activeTab === key
                    ? `bg-gradient-to-r ${color} text-cyan-400 border border-cyan-400/30 shadow-md`
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
       
        
      </div>

      {/* Budget List */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          {/* Table Header (Desktop) */}
          
          <div className="hidden md:grid md:grid-cols-12 bg-gray-700/50 px-6 py-4 border-b border-gray-700 text-gray-400 font-semibold">
            <div className="col-span-4">Category</div>
            <div className="col-span-2">Limit</div>
            <div className="col-span-2">Spent</div>
            <div className="col-span-3">Progress</div>
            <div className="col-span-1"></div>
          </div>

          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((budget) => {
              const percentage = Math.min(budget.progress, 100);
              return (
                <React.Fragment key={budget._id}>
                  {/* Mobile Card */}
                  <div className="md:hidden p-5 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30 transition-all group">
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg bg-gray-700/70 backdrop-blur-sm text-lg">
                        {getBudgetIcon(budget.category)}
                      </div>
                      <div className="ml-3 flex-grow">
                        <p className="font-bold text-white">{budget.category}</p>
                        <p className="text-sm text-gray-400 capitalize">{budget.period}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(budget._id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <FiTrash size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Limit</span>
                        <span className="font-semibold">${budget.limit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Spent</span>
                        <span className={`font-semibold ${percentage >= 100 ? 'text-red-400' : 'text-white'}`}>
                          ${budget.spent.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${getProgressColor(percentage)} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Row */}
                  <div className="hidden md:grid md:grid-cols-12 px-6 py-5 items-center hover:bg-gray-700/40 transition-colors border-b border-gray-700/50 last:border-0 group">
                    <div className="col-span-4 flex items-center">
                      <div className="p-2.5 rounded-xl bg-gray-700/70 backdrop-blur-sm">
                        {getBudgetIcon(budget.category)}
                      </div>
                      <div className="ml-4">
                        <p className="font-bold text-white">{budget.category}</p>
                        <p className="text-sm text-gray-400 capitalize">{budget.period}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold">${budget.limit.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className={`font-semibold ${percentage >= 100 ? 'text-red-400' : 'text-white'}`}>
                        ${budget.spent.toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mr-3 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${getProgressColor(percentage)} transition-all duration-500 group-hover:h-3`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-300 min-w-[40px]">{percentage}%</span>
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete"
                      >
                        <FiTrash size={16} />
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <EmptyState
              icon={<FiTrendingUp className="text-gray-500" />}
              title="No budgets yet"
              message="Start tracking your spending by creating your first budget."
              action={() => {
                setNewBudget(true);
                setFormError("");
                setEditingId(null);
                setFormData({ category: "", limit: "", period: "monthly" });
              }}
            />
          )}
        </div>
      </div>

     
      

      {/* Create Budget Modal */}
      {newBudget && (
        <Modal onClose={() => setNewBudget(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                  <FiPlus className="text-cyan-400" /> 
                </div>
                {editingId ? "Edit Budget" : "Create New Budget"}
              </h3>
              <button
                onClick={() => setNewBudget(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3 rounded-xl mb-6 text-sm flex items-start gap-2">
                <FiAlertTriangle className="mt-0.5 flex-shrink-0" /> 
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2 font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Food">🍔 Food</option>
                  <option value="Transport">🚗 Transport</option>
                  <option value="Entertainment">🎮 Entertainment</option>
                  <option value="Utilities">💡 Utilities</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Rent">🏠 Rent</option>
                  <option value="Other">📦 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 font-medium">Amount ($)</label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleInputChange}
                  placeholder="Enter budget amount"
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 font-medium">Period</label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setNewBudget(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-xl font-medium text-white transition-all shadow-md hover:shadow-cyan-500/20 flex items-center gap-2"
                >
                  {editingId ? 'Update' : 'Create'} Budget
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Reusable Components (Improved)

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:shadow-2xl hover:shadow-cyan-500/15 transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-extrabold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  </div>
);

const EmptyState = ({ icon, title, message, action }) => (
  <div className="text-center py-20 px-6">
    <div className="inline-flex p-4 rounded-full bg-gray-800/50 mb-5 text-4xl">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">{message}</p>
    <button
      onClick={action}
      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2 mx-auto"
    >
      <FiPlus className="w-5 h-5" /> Create Budget
    </button>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-md"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      {children}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-5"></div>
      <p className="text-gray-400 text-lg">Loading budgets...</p>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-md mx-4">
      <FiAlertTriangle className="text-red-400 mx-auto text-4xl mb-3" />
      <p className="text-red-400 text-sm leading-tight">{message}</p>
    </div>
  </div>
);

const BudgetPage = () => (
  <PrivateRoute>
    <BudgetPageContent />
  </PrivateRoute>
);

export default BudgetPage;