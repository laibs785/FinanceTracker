import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DashboardPage from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Budget from './pages/Budget';
import ProfilePage from './pages/profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Features from './components/Features';
import Transaction from './pages/Transaction';
import AddTransaction from './pages/AddTransactionPage';
import API from './api/api';
import Contact from './components/Contact';

function App() {
  const [transactions, setTransactions] = useState([]);
   const [loading, setLoading] = useState(true);

  // Function to add a new transaction
  const addTransaction = async (transactionData) => {
    try {
      const response = await API.post('/transactions', transactionData);
      const newTransaction = response.data;
      setTransactions(prev => [...prev, newTransaction]);
    } catch (err) {
      console.error('Failed to add transaction:', err);
    }
  };
   // ✅ Load transactions from backend on mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await API.get('/transactions');
        setTransactions(response.data);
      } catch (err) {
        console.error('Failed to load transactions:', err);
        // Don't throw — just proceed with empty list
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Function to update a transaction
   const updateTransaction = async (id, updatedData) => {
    try {
      const response = await API.put(`/transactions/${id}`, updatedData);
      setTransactions(prev =>
        prev.map(t => (t._id === id ? response.data : t))
      );
    } catch (err) {
      console.error('Failed to update transaction:', err);
    }
  };

  // Function to delete a transaction
  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };
   if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
          <HeroSection />
          <Features/>
          <Contact />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
       
        <Route path="/transaction" element={
          <PrivateRoute>
            <Transaction 
              transactions={transactions} 
              updateTransaction={updateTransaction}
              deleteTransaction={deleteTransaction}
            />
          </PrivateRoute>
        } />
        <Route path="/budget" element={<Budget />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-transaction" element={
          <PrivateRoute>
            <AddTransaction 
              addTransaction={addTransaction}
            />
          </PrivateRoute>
        } />

        {/*private routes*/}
        <Route path='/dashboard' element={
          <PrivateRoute><DashboardPage />
          </PrivateRoute>} />
          

      </Routes>
    </div>
  );
}

export default App;