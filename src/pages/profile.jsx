
import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEdit,
  FiCreditCard,
  FiBell,
  FiDollarSign,
  FiPieChart,
  FiLogOut,
  FiActivity,
  FiAlertTriangle,
  FiDownload,
  
} from 'react-icons/fi';
import { MdOutlineSecurity } from 'react-icons/md';
import API from '../api/api';
import PrivateRoute from '../components/PrivateRoute';

const ProfilePageContent = () => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    currency: '₹ (INR)',
    notification: true,
    biometric: false,
  });
  const [stats, setStats] = useState({
    totalTransactions: 0,
    categoriesUsed: 0,
    activeBudgets: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Load profile + stats
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        const { user, stats } = res.data;

        setUserData({
          name: user.username,
          email: user.email,
          currency: user.currency || '₹ (INR)',
          notification: user.settings?.emailNotifications ?? true,
          biometric: user.settings?.biometricLogin ?? false,
        });
        setStats(stats);
      } catch (err) {
        setError('Failed to load profile');
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      await API.put('/users/profile', userData);
      localStorage.setItem('user', JSON.stringify({ ...userData }));
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return setError('New passwords do not match');
    }

    try {
      await API.put('/users/password', passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowPasswordModal(false);
      setSuccess('Password changed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleExport = async () => {
    try {
      const response = await API.post('/users/export', { format: 'csv' }, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${new Date().toISOString().slice(0, 7)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccess('Data exported successfully!');
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;

    try {
      await API.delete('/users/account');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6">
      {/* Success/Error Toast */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center">
          ❌ {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 mt-14">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md border border-gray-700 transition-all"
        >
          <FiEdit className="mr-2" />
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile & Stats */}
        <div className="lg:col-span-1">
          {/* Profile Card */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                <FiUser className="text-3xl text-white" />
              </div>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="text-xl font-bold text-center bg-gray-700 border-b border-cyan-400 focus:outline-none mb-1"
                />
              ) : (
                <h2 className="text-xl font-bold">{userData.name}</h2>
              )}
              <p className="text-gray-400">Member since 2022</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-cyan-500/10 mr-3">
                  <FiMail className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p>{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500/10 mr-3">
                  <FiCreditCard className="text-purple-400" />
                </div>
                {editMode ? (
                  <select
                    name="currency"
                    value={userData.currency}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-b border-cyan-400 focus:outline-none"
                  >
                    <option value="₹ (INR)">₹ (INR) - Indian Rupee</option>
                    <option value="$ (USD)">$ (USD) - US Dollar</option>
                    <option value="€ (EUR)">€ (EUR) - Euro</option>
                    <option value="£ (GBP)">£ (GBP) - British Pound</option>
                    <option value="¥ (JPY)">¥ (JPY) - Japanese Yen</option>
                    <option value="A$ (AUD)">A$ (AUD) - Australian Dollar</option>
                  </select>
                ) : (
                  <div>
                    <p className="text-gray-400">Currency</p>
                    <p>{userData.currency}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-500/10 mr-3">
                  <FiBell className="text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400">Notifications</p>
                  <label className="inline-flex items-center mt-1">
                    <input
                      type="checkbox"
                      name="notification"
                      checked={userData.notification}
                      onChange={handleInputChange}
                      className="form-checkbox h-5 w-5 text-cyan-400 rounded focus:ring-cyan-500 border-gray-600"
                    />
                    <span className="ml-2">{userData.notification ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-500/10 mr-3">
                  <MdOutlineSecurity className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400">Biometric Login</p>
                  <label className="inline-flex items-center mt-1">
                    <input
                      type="checkbox"
                      name="biometric"
                      checked={userData.biometric}
                      onChange={handleInputChange}
                      className="form-checkbox h-5 w-5 text-cyan-400 rounded focus:ring-cyan-500 border-gray-600"
                    />
                    <span className="ml-2">{userData.biometric ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>
              </div>
            </div>

            {editMode && (
              <button
                onClick={handleSave}
                className="w-full mt-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-md hover:from-cyan-600 hover:to-purple-700 transition-all"
              >
                Save Changes
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiActivity className="mr-2 text-cyan-400" />
              Your Stats
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Total Transactions', value: stats.totalTransactions, icon: <FiDollarSign /> },
                { label: 'Categories Used', value: stats.categoriesUsed, icon: <FiPieChart /> },
                { label: 'Active Budgets', value: stats.activeBudgets, icon: <FiCreditCard /> },
              ].map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-700/30 rounded-lg transition">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gray-700 mr-3">{stat.icon}</div>
                    <span>{stat.label}</span>
                  </div>
                  <span className="font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Actions */}
        <div className="lg:col-span-2">
          {/* Change Password */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiLock className="mr-2 text-purple-400" />
              Change Password
            </h3>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-all"
            >
              Change Password
            </button>
          </div>

          {/* Export Data */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiDownload className="mr-2 text-green-400" />
              Export Your Data
            </h3>
            <p className="text-gray-400 mb-4">Download your transactions as a CSV file for backup or analysis.</p>
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-all flex items-center"
            >
              <FiDownload className="mr-2" /> Export CSV
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-red-400">
              <FiAlertTriangle className="mr-2" />
              Danger Zone
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-lg">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-gray-400">Permanently erase all your data</p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-all text-sm"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex justify-center items-center py-3 text-red-400 hover:text-red-300 rounded-md border border-red-500/30 hover:border-red-400 transition-all mt-4"
              >
                <FiLogOut className="mr-2" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => (
  <PrivateRoute>
    <ProfilePageContent />
  </PrivateRoute>
);

export default ProfilePage;