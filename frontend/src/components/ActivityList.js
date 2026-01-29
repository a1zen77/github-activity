import React from 'react';
import { motion } from 'framer-motion';
import './ActivityList.css';

const ActivityList = ({ activities, username }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="activity-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="activity-header">
        <h2>Recent Activity</h2>
        <div className="user-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="8" cy="6" r="2.5" fill="currentColor"/>
            <path d="M3 13c0-2.5 2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {username}
        </div>
      </div>
      
      <motion.div 
        className="activity-list"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {activities.map((activity, index) => (
          <motion.div 
            key={index} 
            className="activity-item"
            variants={item}
            whileHover={{ scale: 1.02, x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="activity-icon">
              {getActivityIcon(activity)}
            </div>
            <div className="activity-text">{activity}</div>
            <div className="activity-index">{String(index + 1).padStart(2, '0')}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const getActivityIcon = (activity) => {
  if (activity.includes('Pushed')) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 9h14M12 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else if (activity.includes('Starred')) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2l2.5 5 5.5.5-4 4 1 5.5-5-3-5 3 1-5.5-4-4 5.5-.5L9 2z" fill="currentColor"/>
      </svg>
    );
  } else if (activity.includes('Forked')) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="14" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="14" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 6v5c0 1.5 1 2 2 2h6M14 6v6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    );
  } else if (activity.includes('issue')) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="9" cy="9" r="2" fill="currentColor"/>
      </svg>
    );
  } else if (activity.includes('pull request')) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="4" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 6v6M14 8H8l3-3M8 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  } else if (activity.includes('Created')) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  } else {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2" fill="currentColor"/>
      </svg>
    );
  }
};

export default ActivityList;