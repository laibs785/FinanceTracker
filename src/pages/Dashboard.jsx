
import React, { useState, useEffect } from 'react';
import {
  FiPieChart,
  FiDollarSign,
  FiTrendingUp,
  FiBell,
  FiCreditCard,
  FiFilter,
  FiCalendar,
  FiDownload,
 
  FiArrowUpRight,
  FiAlertTriangle,
  FiPlus   
} from 'react-icons/fi';

import { MdOutlineSavings } from 'react-icons/md';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import API from '../api/api';
import PrivateRoute from '../components/PrivateRoute';

ChartJS.register(...registerables);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get('/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const savingsRate = data.totalIncome > 0
    ? Math.round((data.totalBalance / data.totalIncome) * 100)
    : 0;

  //  Overview Chart 
  const monthlyLabels = data.monthlyData.map(m => m.month);
  const incomeData = data.monthlyData.map(m => m.income);
  const expenseData = data.monthlyData.map(m => m.expenses);

  const spendingData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 6,
      },
    ],
  };
  

  // Category chart (pie)
  const categoryLabels = Object.keys(data.categorySpending);
  const categoryAmounts = Object.values(data.categorySpending);

  const categoryData = {
    labels: categoryLabels.length ? categoryLabels : ['No Data'],
    datasets: [
      {
        data: categoryAmounts.length ? categoryAmounts : [1],
        backgroundColor: [
          '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316', '#84cc16', '#0ea5e9'
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const handleExport = () => {
    let csv = 'Category,Amount\n';
    Object.entries(data.categorySpending).forEach(([cat, amt]) => {
      csv += `${cat},${amt}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spending-summary-${new Date().toISOString().slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/70 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FiDollarSign className="text-white text-lg" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
            <FiBell className="text-cyan-400" />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-6 pt-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Balance"
            value={`₹${data.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<FiDollarSign />}
            color="from-cyan-500 to-blue-600"
            subText={`+₹${data.totalIncome.toLocaleString()} Income • -₹${data.totalExpenses.toLocaleString()} Expenses`}
          />

          <SummaryCard
            title="Savings Rate"
            value={`${savingsRate}%`}
            icon={<MdOutlineSavings />}
            color="from-purple-500 to-pink-600"
            subText="of income saved"
            children={
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(savingsRate, 100)}%` }}
                ></div>
              </div>
            }
          />

          <SummaryCard
            title="Top Category"
            value={data.topCategory}
            icon={<FiCreditCard />}
            color="from-yellow-500 to-orange-600"
            subText={`₹${data.totalExpenses.toFixed(2)} spent`}
          />

          <SummaryCard
            title="Upcoming Bills"
            value={`${data.upcomingBills.length}`}
            icon={<FiBell />}
            color="from-red-500 to-pink-600"
            subText="due in next 7 days"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Overview */}
          <ChartCard
            title="Monthly Overview"
            icon={FiTrendingUp}
            color="text-cyan-400"
          >
            <Bar
              data={spendingData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top', labels: { color: '#9ca3af' } },
                },
                scales: {
                  x: { grid: { color: 'rgba(55, 65, 81, 0.2)' }, ticks: { color: '#9ca3af' } },
                  y: { grid: { color: 'rgba(55, 65, 81, 0.2)' }, ticks: { color: '#9ca3af' } }
                }
              }}
            />
          </ChartCard>

          {/* Spending by Category */}
          <ChartCard
            title="Spending by Category"
            icon={FiPieChart}
            color="text-purple-400"
            action={handleExport}
            actionIcon={FiDownload}
          >
            <div className="h-64 flex items-center justify-center">
              {categoryLabels.length > 0 ? (
                <Pie
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right', labels: { color: '#9ca3af', usePointStyle: true } }
                    }
                  }}
                />
              ) : (
                <p className="text-gray-500">No expenses yet</p>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Transactions & Budgets */}
        <div className="grid grid-cols-1 lg:col-span-3 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-gray-800/60 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <FiDollarSign className="mr-2 text-green-400" />
                Recent Transactions
              </h3>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
                  <FiFilter />
                </button>
                <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
                  <FiCalendar />
                </button>
                <button
                  onClick={() => (window.location.href = '/add-transaction')}
                  className="flex items-center px-3 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition text-sm"
                >
                  <FiPlus /> <span className="ml-1">Add</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((t) => (
                  <div
                    key={t._id}
                    className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition group"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          t.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}
                      >
                        <FiDollarSign
                          className={t.type === 'income' ? 'text-green-400' : 'text-red-400'}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{t.description}</p>
                        <p className="text-sm text-gray-400">{t.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p
                        className={`font-bold ${
                          t.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                      </p>
                      <FiArrowUpRight className="opacity-0 group-hover:opacity-100 text-cyan-400 ml-2 transition" />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState text="No transactions yet" />
              )}
            </div>
          </div>

          {/* Top Budgets */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold flex items-center mb-6">
              <FiCreditCard className="mr-2 text-purple-400" />
              Top Budgets
            </h3>

            {data.topBudgets.length > 0 ? (
              <div className="space-y-5">
                {data.topBudgets.map((budget) => {
                  let progressColor = 'bg-green-500';
                  if (budget.progress >= 75) progressColor = 'bg-yellow-500';
                  if (budget.progress >= 100) progressColor = 'bg-red-500';

                  return (
                    <div key={budget._id} className="group cursor-default">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{budget.category}</span>
                        <span className="text-gray-300">
                          ₹{budget.spent.toLocaleString()}/₹{budget.limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                        <div
                          className={`h-2 rounded-full ${progressColor} transition-all duration-500 group-hover:h-3`}
                          style={{ width: `${Math.min(budget.progress, 100)}%` }}
                        ></div>
                      </div>
                      <p className={`text-xs ${progressColor.replace('bg-', 'text-')}`}>
                        {budget.progress.toFixed(1)}% used
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState text="No budgets yet" subText="Create one to get started" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Components
const SummaryCard = ({ title, value, icon, color, subText, children }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-gray-400 text-sm mt-2">{subText}</p>
      </div>
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition`}>
        {icon}
      </div>
    </div>
    {children}
  </div>
);

const ChartCard = ({ title, icon: Icon, color, children, action, actionIcon: ActionIcon }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
    <div className="flex justify-between items-center mb-6">
      <h3 className={`text-lg font-semibold flex items-center ${color}`}>
        <Icon className="mr-2" />
        {title}
      </h3>
      {action && (
        <button
          onClick={action}
          className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md transition"
        >
          <ActionIcon className="mr-1" /> Export
        </button>
      )}
    </div>
    <div className="h-64">{children}</div>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"></div>
      <p className="text-gray-400">Loading dashboard...</p>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
      <FiAlertTriangle className="text-red-400 mx-auto text-3xl mb-2" />
      <p className="text-red-400">{message}</p>
    </div>
  </div>
);

const EmptyState = ({ text, subText }) => (
  <div className="text-center py-8 text-gray-500">
    <FiCreditCard className="mx-auto text-4xl mb-2 opacity-50" />
    <p className="font-medium">{text}</p>
    {subText && <p className="text-sm mt-1">{subText}</p>}
  </div>
);

const DashboardPage = () => (
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
);

export default DashboardPage;