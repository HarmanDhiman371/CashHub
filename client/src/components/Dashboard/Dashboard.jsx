import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-logo">CH</div>
        <h1 className="dashboard-title">Welcome to Dashboard</h1>
        <p className="dashboard-subtitle">You have successfully logged in!</p>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <div className="stat-value">1</div>
              <div className="stat-label">Active Account</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🟢</div>
            <div className="stat-content">
              <div className="stat-value">Online</div>
              <div className="stat-label">Status</div>
            </div>
          </div>
        </div>

        <button className="dashboard-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;