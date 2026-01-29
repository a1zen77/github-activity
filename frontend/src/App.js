import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App.css';
import ActivityList from './components/ActivityList';

function App() {
  const [username, setUsername] = useState('');
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedUser, setSearchedUser] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setActivity([]);

    try {
      const response = await axios.get(`/api/user/${username}/activity`);
      setActivity(response.data.activity);
      setSearchedUser(response.data.username);
      
      if (response.data.activity.length === 0) {
        setError('No recent activity found for this user');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`User '${username}' not found on GitHub`);
      } else if (err.response?.status === 403) {
        setError('Rate limit exceeded. Please try again later.');
      } else {
        setError('Failed to fetch activity. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="background-grid"></div>
      <div className="background-gradient"></div>
      
      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.header 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 2L37 12V28L20 38L3 28V12L20 2Z" stroke="url(#gradient)" strokeWidth="2"/>
              <circle cx="20" cy="20" r="6" fill="url(#gradient)"/>
              <defs>
                <linearGradient id="gradient" x1="3" y1="2" x2="37" y2="38">
                  <stop offset="0%" stopColor="#00f2ff"/>
                  <stop offset="100%" stopColor="#0066ff"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>GitHub Activity Tracker</h1>
          <p className="subtitle">Explore recent activity from any GitHub user</p>
        </motion.header>

        <motion.form 
          onSubmit={handleSubmit} 
          className="search-form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="input-wrapper">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" fill="currentColor"/>
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username..."
              className="search-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8.5 3C5.46 3 3 5.46 3 8.5S5.46 14 8.5 14 14 11.54 14 8.5 11.54 3 8.5 3zM17 17l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </motion.form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activity.length > 0 && (
            <ActivityList activities={activity} username={searchedUser} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;