
import React, { useState } from 'react';
import { 
  FiMail, 
  FiSend, 
  FiPhone, 
  FiMessageCircle, 
  FiCheckCircle, 
  FiAlertCircle 
} from 'react-icons/fi';

import { FaTwitter, FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    
    setTimeout(() => {
      if (!email || !message) {
        setStatus({ type: 'error', message: 'Please fill in all fields.' });
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setStatus({ type: 'error', message: 'Please enter a valid email.' });
      } else {
        setStatus({ type: 'success', message: 'Thanks! We’ll get back to you soon.' });
        setEmail('');
        setMessage('');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="relative py-24 px-4 bg-gray-900 overflow-hidden">
      
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
              Let’s Talk
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
              Have questions or feedback? We’d love to hear from you. Reach out and we’ll get back within 24 hours.
            </p>

            
            <div className="space-y-5 mb-8">
              <div className="flex items-start space-x-4 group">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 group-hover:scale-110 transition">
                  <FiMail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Us</h3>
                  <p className="text-gray-400">support@financetracker.app</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 text-purple-400 group-hover:scale-110 transition">
                  <FiPhone size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Call Support</h3>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 text-emerald-400 group-hover:scale-110 transition">
                  <FiMessageCircle size={20} />
                </div>
                  <div>
                  <h3 className="font-semibold text-white">Live Chat</h3>
                  <p className="text-gray-400">Available 9 AM – 6 PM IST</p>
                </div>
              </div>
            </div>

            
            <div className="flex space-x-4">
              {[
                { icon: FaTwitter, color: 'hover:text-cyan-400', link: '#' },
                { icon: FaInstagram, color: 'hover:text-pink-400', link: '#' },
                { icon: FaLinkedin, color: 'hover:text-blue-400', link: '#' },
                { icon: FaGithub, color: 'hover:text-gray-300', link: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 hover:scale-110 transition-transform duration-200 ${social.color}`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  disabled={loading}
                />
              </div>

              <div>
                <textarea
                  placeholder="Your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="5"
                  className="w-full p-4 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 group"
              >
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                <FiSend className={`transition-transform ${loading ? '' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
              </button>
            </form>

            
            {status && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm flex items-center space-x-2 border ${
                  status.type === 'success'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}
              >
                {status.type === 'success' ? (
                  <FiCheckCircle />
                ) : (
                  <FiAlertCircle />
                )}
                <span>{status.message}</span>
              </div>
            )}
          </div>
        </div>

        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;