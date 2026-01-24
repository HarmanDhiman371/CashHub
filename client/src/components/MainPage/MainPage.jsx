import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    scheduledPosts: 0,
    activeRules: 0,
    moderatedComments: 0,
    connectedAccounts: 1
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadDashboardData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    // Simulate API calls - replace with actual APIs
    setTimeout(() => {
      setStats({
        scheduledPosts: 12,
        activeRules: 5,
        moderatedComments: 47,
        connectedAccounts: 1
      });
      
      setRecentActivity([
        { id: 1, type: 'post', action: 'scheduled', time: '2 hours ago', icon: '📅' },
        { id: 2, type: 'comment', action: 'moderated', time: '5 hours ago', icon: '🛡️' },
        { id: 3, type: 'rule', action: 'created', time: '1 day ago', icon: '⚙️' },
        { id: 4, type: 'post', action: 'published', time: '2 days ago', icon: '✅' },
        { id: 5, type: 'account', action: 'connected', time: '3 days ago', icon: '🔗' }
      ]);
      
      setIsLoading(false);
    }, 1000);
  };

  const handleGoToSchedule = () => {
    navigate('/schedule');
  };

  const handleGoToModeration = () => {
    navigate('/moderation');
  };

  const handleGoToConnections = () => {
    navigate('/connections');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      {/* Animated Background */}
      <div className="dashboard-background"></div>
      
      {/* Main Container */}
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="brand-logo">CH</div>
              <div className="brand-text">
                <h1 className="brand-title">ClashHub</h1>
                <p className="brand-subtitle">Social Media Automation Platform</p>
              </div>
            </div>
            
            <div className="header-right">
              <div className="user-profile">
                <div className="user-avatar">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.username}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h2 className="welcome-title">
                Welcome back, <span className="highlight">{user.username}</span>! 👋
              </h2>
              <p className="welcome-text">
                Manage your Instagram automation from one place. Schedule posts, moderate comments, and track performance.
              </p>
            </div>
            <div className="welcome-illustration">🚀</div>
          </section>

          {/* Stats Grid */}
          <section className="stats-section">
            <h3 className="section-title">Overview</h3>
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.scheduledPosts}</div>
                  <div className="stat-label">Scheduled Posts</div>
                </div>
                <div className="stat-trend">↑ 12% this week</div>
              </div>
              
              <div className="stat-card purple">
                <div className="stat-icon">🛡️</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.activeRules}</div>
                  <div className="stat-label">Active Rules</div>
                </div>
                <div className="stat-trend">Protecting your comments</div>
              </div>
              
              <div className="stat-card green">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.moderatedComments}</div>
                  <div className="stat-label">Comments Moderated</div>
                </div>
                <div className="stat-trend">↓ 8% spam this week</div>
              </div>
              
              <div className="stat-card orange">
                <div className="stat-icon">🔗</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.connectedAccounts}</div>
                  <div className="stat-label">Connected Accounts</div>
                </div>
                <div className="stat-trend">Instagram connected</div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-grid">
              <div className="action-card schedule" onClick={handleGoToSchedule}>
                <div className="action-icon">📝</div>
                <div className="action-content">
                  <h4 className="action-title">Schedule Posts</h4>
                  <p className="action-description">
                    Create and schedule Instagram stories, posts, and reels
                  </p>
                </div>
                <button className="action-btn">Go to Schedule →</button>
              </div>
              
              <div className="action-card moderation" onClick={handleGoToModeration}>
                <div className="action-icon">⚙️</div>
                <div className="action-content">
                  <h4 className="action-title">Comment Moderation</h4>
                  <p className="action-description">
                    Set up auto-moderation rules for Instagram comments
                  </p>
                </div>
                <button className="action-btn">Manage Rules →</button>
              </div>
              
              <div className="action-card connections" onClick={handleGoToConnections}>
                <div className="action-icon">🔗</div>
                <div className="action-content">
                  <h4 className="action-title">Account Connections</h4>
                  <p className="action-description">
                    Manage your connected social media accounts
                  </p>
                </div>
                <button className="action-btn">View Connections →</button>
              </div>
              
              <div className="action-card analytics">
                <div className="action-icon">📊</div>
                <div className="action-content">
                  <h4 className="action-title">Analytics</h4>
                  <p className="action-description">
                    View performance insights and engagement metrics
                  </p>
                </div>
                <button className="action-btn disabled">Coming Soon</button>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="activity-section">
            <div className="activity-header">
              <h3 className="section-title">Recent Activity</h3>
              <button className="view-all-btn">View All →</button>
            </div>
            
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <p className="activity-text">
                      Instagram post <span className="highlight">{activity.action}</span>
                    </p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${activity.action}`}>
                      {activity.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips & Updates */}
          <section className="tips-section">
            <h3 className="section-title">Pro Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">💡</div>
                <h4 className="tip-title">Best Posting Times</h4>
                <p className="tip-text">
                  Schedule posts between 9 AM - 11 AM for maximum engagement on Instagram
                </p>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <h4 className="tip-title">Keyword Strategy</h4>
                <p className="tip-text">
                  Add 5-7 relevant keywords to your moderation rules for better coverage
                </p>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">📈</div>
                <h4 className="tip-title">Growth Tips</h4>
                <p className="tip-text">
                  Post consistently and engage with comments to boost your reach
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-links">
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">Contact Support</a>
              <a href="#" className="footer-link">Privacy Policy</a>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} ClashHub Platform. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainPage;