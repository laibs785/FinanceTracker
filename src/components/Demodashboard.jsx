import React from 'react'

export const Demodashboard = () => {
  return (
    <div>
   
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Your Financial Dashboard
        </h2>
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400">Monthly Balance</p>
              <p className="text-2xl font-bold text-green-400">+₹32,500</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">₹18,200</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400">Savings Rate</p>
              <p className="text-2xl font-bold text-cyan-400">24%</p>
            </div>
          </div>
          
          <div className="h-64 bg-gray-700/20 rounded-lg border border-dashed border-gray-600 flex items-center justify-center">
            <p className="text-gray-400">Monthly Spending Chart</p>
          </div>
        </div>
      </div>
    </section>
  

    </div>
  )
}
