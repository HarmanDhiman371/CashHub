import React, { useState, useEffect } from 'react';
import { getModeratedComments } from './ModerationAPI';

const RulesDashboard = ({ onError }) => {
  const [moderatedComments, setModeratedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchModeratedComments();
  }, []);

  const fetchModeratedComments = async () => {
    try {
      setIsLoading(true);
      const comments = await getModeratedComments(100); // Get last 100 moderated comments
      setModeratedComments(comments);
      onError('');
    } catch (error) {
      console.error('Error fetching moderated comments:', error);
      onError('Failed to load moderation logs. Please try again.');
      setModeratedComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case 'hide':
        return '👁️';
      case 'delete':
        return '🗑️';
      case 'block':
        return '🚫';
      default:
        return '⚙️';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  const filterComments = () => {
    let filtered = moderatedComments;

    // Apply time filter
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
      }

      filtered = filtered.filter(comment => {
        const commentDate = new Date(comment.moderated_at);
        return commentDate >= cutoff;
      });
    }

    // Apply search filter
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
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
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
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Moderation Actions</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon today">📅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.today}</div>
            <div className="stat-label">Today's Actions</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon hidden">👁️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.hidden}</div>
            <div className="stat-label">Comments Hidden</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon deleted">🗑️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.deleted}</div>
            <div className="stat-label">Comments Deleted</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
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
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Search comments or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Actions */}
      <div className="dashboard-actions">
        <button
          className="refresh-btn"
          onClick={fetchModeratedComments}
          disabled={isLoading}
        >
          {isLoading ? '🔄 Refreshing...' : '🔄 Refresh Logs'}
        </button>
        
        <div className="results-count">
          Showing {filteredComments.length} of {moderatedComments.length} moderation actions
        </div>
      </div>

      {/* Comments Table */}
      {filteredComments.length === 0 ? (
        <div className="no-comments">
          <div className="no-comments-icon">📝</div>
          <h3>No moderation activity yet</h3>
          <p>
            {searchTerm || filter !== 'all' 
              ? 'No moderation logs match your filters. Try different search terms or time periods.'
              : 'Create moderation rules to start auto-moderating comments. Moderation activity will appear here.'
            }
          </p>
        </div>
      ) : (
        <div className="comments-table">
          <div className="table-header">
            <div className="table-col comment">Comment</div>
            <div className="table-col keyword">Matched Keyword</div>
            <div className="table-col action">Action</div>
            <div className="table-col status">Status</div>
            <div className="table-col time">Time</div>
          </div>
          
          <div className="table-body">
            {filteredComments.map((comment, index) => (
              <div key={index} className="table-row">
                <div className="table-col comment">
                  <div className="comment-text">
                    {comment.comment_text || 'No comment text'}
                  </div>
                </div>
                
                <div className="table-col keyword">
                  <span className="keyword-badge">
                    {comment.matched_keyword || 'N/A'}
                  </span>
                </div>
                
                <div className="table-col action">
                  <div className="action-cell">
                    <span className="action-icon">
                      {getActionIcon(comment.action)}
                    </span>
                    <span className="action-text">
                      {comment.action || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="table-col status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(comment.status) }}
                  >
                    {comment.status || 'Completed'}
                  </span>
                </div>
                
                <div className="table-col time">
                  <span className="time-text">
                    {formatDate(comment.moderated_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="dashboard-info">
        <h4>About Moderation Logs</h4>
        <div className="info-content">
          <p>
            This dashboard shows comments that were automatically moderated based on your rules.
            Each entry includes:
          </p>
          <ul className="info-list">
            <li><strong>Comment:</strong> The original comment text</li>
            <li><strong>Matched Keyword:</strong> Which keyword triggered the moderation</li>
            <li><strong>Action:</strong> What was done (hide, delete, block)</li>
            <li><strong>Status:</strong> Success status of the moderation</li>
            <li><strong>Time:</strong> When the moderation occurred</li>
          </ul>
          <p className="info-note">
            Note: Moderation happens automatically in real-time as new comments are posted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesDashboard;