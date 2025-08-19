
import React from 'react';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden px-4">
      
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Side: Text & CTA */}
        <div className="text-left space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Take Control of Your
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Finances</span>
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
            Track every rupee, set smart budgets, and grow your wealth with a beautiful, intuitive finance tracker built for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 text-center"
            >
              Get Started Free
            </Link>
            <Link
              to="/transaction"
              className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition-all duration-200 text-center border border-gray-600"
            >
              View Demo
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 pt-6">
            {[
              { icon: FiDollarSign, label: "Track Expenses" },
              { icon: FiPieChart, label: "Smart Budgets" },
              { icon: FiTrendingUp, label: "Growth Insights" },
              { icon: FiShield, label: "Secure & Private" },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <item.icon className="text-cyan-400" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Dashboard Preview */}
        <div className="relative hidden lg:block">
          <div className="relative bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl max-w-md mx-auto transform rotate-1 hover:rotate-0 transition duration-300">
            
            
            <div className="flex items-center justify-between mb-6">
              <div className="w-8 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded"></div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
            </div>

            
            <div className="bg-gradient-to-br from-cyan-900/50 to-purple-900/50 border border-cyan-500/30 rounded-xl p-4 mb-4">
              <p className="text-gray-300 text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-white">₹12,340</p>
            </div>

            
            <div className="space-y-3 mb-4">
              {[
                { name: "Food", spent: 500, limit: 1000, color: "bg-red-500" },
                { name: "Rent", spent: 8000, limit: 8000, color: "bg-green-500" },
                { name: "Shopping", spent: 1200, limit: 1000, color: "bg-yellow-500" },
              ].map((budget, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>{budget.name}</span>
                    <span>₹{budget.spent}/{budget.limit}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${budget.color}`}
                      style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            
            <div className="text-gray-400 text-xs space-y-2">
              <p>• 🍕 Pizza - ₹500 • Today</p>
              <p>• 💸 Salary - ₹40,000 • Apr 1</p>
              <p>• 🛒 Groceries - ₹1,200 • Apr 3</p>
            </div>
          </div>

          
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
            New!
          </div>
        </div>
      </div>

      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;