import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModerationPage.css';
import MediaSelector from './MediaSelector';
import RuleCreator from './RuleCreator';
import RulesDashboard from './RulesDashboard';
import { getInstagramMedia, getModeratedComments } from './ModerationAPI';

const ModerationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('media'); // 'media', 'create', 'dashboard'
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleMediaSelect = (media) => {
    setSelectedMedia(media);
    setActiveTab('create');
  };

  const handleRuleCreated = () => {
    setSelectedMedia(null);
    setActiveTab('dashboard');
  };

  const handleBackToSchedule = () => {
    navigate('/schedule');
  };

  if (isLoading) {
    return (
      <div className="moderation-loading">
        <div className="loading-spinner"></div>
        <p>Loading moderation dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="moderation-container">
      {/* Animated Background */}
      <div className="moderation-bg"></div>
      
      {/* Main Card */}
      <div className="moderation-card">
        {/* Header */}
        <div className="moderation-header">
          <button className="back-btn" onClick={handleBackToSchedule}>
            ← Back to Schedule
          </button>
          <div className="moderation-logo">⚙️</div>
          <h1 className="moderation-title">Comment Moderation</h1>
          <p className="moderation-subtitle">
            Automatically moderate comments on your Instagram posts
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button className="error-close" onClick={() => setError('')}>
              ✕
            </button>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="tabs-navigation">
          <button
            className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <span className="tab-icon">📸</span>
            <span className="tab-text">Select Media</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''} ${!selectedMedia ? 'disabled' : ''}`}
            onClick={() => selectedMedia && setActiveTab('create')}
            disabled={!selectedMedia}
          >
            <span className="tab-icon">✏️</span>
            <span className="tab-text">Create Rule</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="tab-icon">📊</span>
            <span className="tab-text">Dashboard & Logs</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'media' && (
            <MediaSelector 
              onMediaSelect={handleMediaSelect}
              onError={setError}
            />
          )}
          
          {activeTab === 'create' && selectedMedia && (
            <RuleCreator 
              media={selectedMedia}
              onRuleCreated={handleRuleCreated}
              onError={setError}
              onBack={() => setActiveTab('media')}
            />
          )}
          
          {activeTab === 'dashboard' && (
            <RulesDashboard 
              onError={setError}
            />
          )}
        </div>

        {/* Footer */}
        <div className="moderation-footer">
          <p className="footer-note">
            Rules will automatically moderate new comments on selected posts
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} ClashHub Moderation. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModerationPage;