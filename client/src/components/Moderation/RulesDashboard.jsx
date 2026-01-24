import React, { useState, useEffect, useCallback } from 'react';
import { getModeratedComments } from './ModerationAPI';
import './RulesDashboard.css';

const RulesDashboard = ({ onError }) => {
  const [moderatedComments, setModeratedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Wrap fetchModeratedComments in useCallback
  const fetchModeratedComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const comments = await getModeratedComments(100);
      setModeratedComments(Array.isArray(comments) ? comments : []);
      onError('');
    } catch (error) {
      console.error('Error fetching moderated comments:', error);
      onError('Failed to load moderation logs. Please try again.');
      setModeratedComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchModeratedComments();
  }, [fetchModeratedComments]); // Add fetchModeratedComments to dependencies

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActionDetails = (action) => {
    switch (action?.toLowerCase()) {
      case 'hide':
        return { icon: '👁️', label: 'Hidden', color: '#f59e0b' };
      case 'delete':
        return { icon: '🗑️', label: 'Deleted', color: '#ef4444' };
      case 'block':
        return { icon: '🚫', label: 'Blocked', color: '#dc2626' };
      default:
        return { icon: '⚙️', label: 'Moderated', color: '#94a3b8' };
    }
  };

  const filterComments = () => {
    let filtered = [...moderatedComments];

    if (filter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filter) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        default:
          // No additional filtering needed for 'all'
          break;
      }

      filtered = filtered.filter(comment => {
        const commentDate = new Date(comment.moderated_at);
        return commentDate >= cutoff;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(comment => 
        comment.comment_text?.toLowerCase().includes(term) ||
        comment.matched_keyword?.toLowerCase().includes(term) ||
        comment.action?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredComments = filterComments();

  const stats = {
    total: moderatedComments.length,
    today: moderatedComments.filter(c => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(c.moderated_at) >= today;
    }).length,
    hidden: moderatedComments.filter(c => c.action?.toLowerCase() === 'hide').length,
    deleted: moderatedComments.filter(c => c.action?.toLowerCase() === 'delete').length,
    blocked: moderatedComments.filter(c => c.action?.toLowerCase() === 'block').length,
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p>Loading moderation logs...</p>
      </div>
    );
  }

  return (
    <div className="rules-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Moderation Dashboard</h2>
        <p className="dashboard-subtitle">
          View auto-moderation activity and logs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Actions</div>
          </div>
        </div>
        
        <div className="stat-card today">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.today}</div>
            <div className="stat-label">Today</div>
          </div>
        </div>
        
        <div className="stat-card hidden">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.hidden}</div>
            <div className="stat-label">Hidden</div>
          </div>
        </div>
        
        <div className="stat-card deleted">
          <div className="stat-icon">🗑️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.deleted}</div>
            <div className="stat-label">Deleted</div>
          </div>
        </div>
        
        <div className="stat-card blocked">
          <div className="stat-icon">🚫</div>
          <div className="stat-content">
            <div className="stat-number">{stats.blocked}</div>
            <div className="stat-label">Blocked</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Time
          </button>
          <button
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button
            className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
            onClick={() => setFilter('week')}
          >
            Last 7 Days
          </button>
          <button
            className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
            onClick={() => setFilter('month')}
          >
            Last 30 Days
          </button>
        </div>
        
        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search comments or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Actions */}
      <div className="dashboard-actions">
        <button
          className="refresh-logs-btn"
          onClick={fetchModeratedComments}
          disabled={isLoading}
        >
          {isLoading ? '🔄 Refreshing...' : '🔄 Refresh Logs'}
        </button>
        
        <div className="results-info">
          Showing <span className="highlight-count">{filteredComments.length}</span> of{' '}
          <span className="total-count">{moderatedComments.length}</span> moderation actions
        </div>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="empty-dashboard">
          <div className="empty-icon">📝</div>
          <h3>No moderation activity yet</h3>
          <p>
            {searchTerm || filter !== 'all' 
              ? 'No moderation logs match your filters. Try different search terms or time periods.'
              : 'Create moderation rules to start auto-moderating comments. Moderation activity will appear here.'
            }
          </p>
        </div>
      ) : (
        <div className="moderation-logs">
          <div className="logs-header">
            <div className="header-column comment">Comment</div>
            <div className="header-column keyword">Keyword</div>
            <div className="header-column action">Action</div>
            <div className="header-column time">Time</div>
          </div>
          
          <div className="logs-list">
            {filteredComments.map((comment, index) => {
              const actionDetails = getActionDetails(comment.action);
              return (
                <div key={index} className="log-item">
                  <div className="log-column comment">
                    <div className="comment-content">
                      {comment.comment_text || 'No comment text'}
                    </div>
                  </div>
                  
                  <div className="log-column keyword">
                    <span className="keyword-badge">
                      {comment.matched_keyword || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="log-column action">
                    <div className="action-badge" style={{ backgroundColor: actionDetails.color }}>
                      <span className="action-icon">{actionDetails.icon}</span>
                      <span className="action-label">{actionDetails.label}</span>
                    </div>
                  </div>
                  
                  <div className="log-column time">
                    <span className="time-badge">
                      {formatDate(comment.moderated_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="dashboard-info">
        <h4 className="info-title">About Moderation Logs</h4>
        <div className="info-content">
          <p className="info-text">
            This dashboard shows comments that were automatically moderated based on your rules.
          </p>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">💬</span>
              <div className="info-details">
                <strong>Comment</strong>
                <p>The original comment text</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🔑</span>
              <div className="info-details">
                <strong>Keyword</strong>
                <p>Which keyword triggered the moderation</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⚡</span>
              <div className="info-details">
                <strong>Action</strong>
                <p>What was done (hide, delete, block)</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⏰</span>
              <div className="info-details">
                <strong>Time</strong>
                <p>When the moderation occurred</p>
              </div>
            </div>
          </div>
          <p className="info-note">
            Note: Moderation happens automatically in real-time as new comments are posted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesDashboard;