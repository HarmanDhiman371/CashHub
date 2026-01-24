import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaSelector from './MediaSelector';
import RuleCreator from './RuleCreator';
import RulesDashboard from './RulesDashboard';
import './ModerationPage.css';

const ModerationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('media');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      // User data is parsed but not stored in state since we don't use it
      JSON.parse(userData);
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
        <div className="moderation-spinner"></div>
        <p>Loading moderation dashboard...</p>
      </div>
    );
  }

  return (
    <div className="moderation-page">
      <div className="moderation-background"></div>
      
      <div className="moderation-container">
        {/* Header */}
        <div className="moderation-header">
          <button className="moderation-back-btn" onClick={handleBackToSchedule}>
            ← Back to Schedule
          </button>
          <div className="moderation-logo">⚙️</div>
          <h1 className="moderation-main-title">Comment Moderation</h1>
          <p className="moderation-subtitle">
            Automatically moderate comments on your Instagram posts
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="moderation-error">
            <span className="error-icon">⚠️</span>
            <span className="error-message-text">{error}</span>
            <button className="error-close-btn" onClick={() => setError('')}>
              ✕
            </button>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="moderation-tabs">
          <button
            className={`moderation-tab ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <span className="tab-icon">📸</span>
            <span className="tab-label">Select Media</span>
          </button>
          <button
            className={`moderation-tab ${activeTab === 'create' ? 'active' : ''} ${!selectedMedia ? 'disabled' : ''}`}
            onClick={() => selectedMedia && setActiveTab('create')}
            disabled={!selectedMedia}
          >
            <span className="tab-icon">✏️</span>
            <span className="tab-label">Create Rule</span>
          </button>
          <button
            className={`moderation-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="tab-icon">📊</span>
            <span className="tab-label">Dashboard</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="moderation-content">
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
            <RulesDashboard onError={setError} />
          )}
        </div>

        {/* Footer */}
        <div className="moderation-footer">
          <p className="footer-text">
            Rules will automatically moderate new comments on selected posts
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModerationPage;