
import React, { useState, useEffect } from 'react';
import {
  FiPieChart,
  FiDollarSign,
  FiTrendingUp,
  FiShield,
  FiCalendar,
  FiZap,
  FiCheckCircle,
  FiGlobe,
  FiArrowUpRight,
} from 'react-icons/fi';

const Features = () => {
  const [revealed, setRevealed] = useState([]);

  
  useEffect(() => {
    const handleScroll = () => {
      const featureItems = document.querySelectorAll('.feature-item');
      featureItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && !revealed.includes(index)) {
          setTimeout(() => {
            setRevealed(prev => [...prev, index]);
          }, index * 120); // Faster stagger
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [revealed]);

  const features = [
    {
      icon: FiPieChart,
      title: "Smart Budgets",
      description: "Set limits by category and get real-time alerts before you overspend.",
      color: "from-purple-400 to-pink-500",
      glow: "shadow-lg shadow-purple-500/25",
      iconGlow: "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
    },
    {
      icon: FiDollarSign,
      title: "Expense Tracking",
      description: "Log every rupee with smart categories. Never miss a transaction again.",
      color: "from-cyan-400 to-blue-500",
      glow: "shadow-lg shadow-cyan-500/25",
      iconGlow: "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]",
    },
    {
      icon: FiTrendingUp,
      title: "Financial Insights",
      description: "Powerful analytics show trends, habits, and savings opportunities.",
      color: "from-emerald-400 to-teal-500",
      glow: "shadow-lg shadow-emerald-500/25",
      iconGlow: "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    },
    {
      icon: FiShield,
      title: "Bank-Level Security",
      description: "End-to-end encryption keeps your financial data safe and private.",
      color: "from-rose-400 to-orange-500",
      glow: "shadow-lg shadow-rose-500/25",
      iconGlow: "text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]",
    },
    {
      icon: FiCalendar,
      title: "Monthly Reports",
      description: "Auto-generated reports help you reflect, plan, and grow each month.",
      color: "from-indigo-400 to-violet-500",
      glow: "shadow-lg shadow-indigo-500/25",
      iconGlow: "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]",
    },
    {
      icon: FiZap,
      title: "Lightning Fast UX",
      description: "Add a transaction in under 3 seconds. Speed built into every pixel.",
      color: "from-yellow-400 to-amber-500",
      glow: "shadow-lg shadow-yellow-500/25",
      iconGlow: "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]",
    },
  ];

  return (
    <section className="relative py-24 px-4 bg-gray-900 overflow-hidden">
      
      <div className="absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-gradient-to-l from-pink-500/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

  
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-40 animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: '2s',
          }}
        ></div>
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
      
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-300 bg-clip-text text-transparent animate-gradient-x">
            Supercharge Your Finances
          </h2>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-90">
            Every feature is designed to make managing money <strong>effortless, insightful, and even fun</strong>.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isRevealed = revealed.includes(index);

            return (
              <div
                key={index}
                className={`feature-item group relative p-7 rounded-3xl border border-gray-700 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-default ${
                  isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 30, 40, 0.7), rgba(20, 20, 30, 0.8))',
                  backdropFilter: 'blur(12px)',
                  transform: isRevealed ? 'none' : undefined,
                  transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
              >
                
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.glow} pointer-events-none`}></div>

              
                <div className="relative mb-5 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="p-4 rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-gray-600 group-hover:border-transparent">
                    <Icon className={`w-8 h-8 ${feature.iconGlow} transition-all duration-300`} />
                  </div>
                </div>

            
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-500">
                  {feature.title}
                </h3>

                
                <p className="text-gray-300 leading-relaxed mb-5 group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>

            
                <div className="flex items-center text-sm font-medium text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span>Learn more</span>
                  <FiArrowUpRight className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>

                
                <div className="absolute -right-3 -top-3 w-8 h-8 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <FiCheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </div>
            );
          })}
        </div>

        
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
            <FiGlobe className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <span>Syncs across Web, iOS & Android</span>
            <FiArrowUpRight className="w-4 h-4 text-purple-400 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes gradientX {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #8b5cf6, #06b6d4);
          background-size: 400% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientX 8s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Features;