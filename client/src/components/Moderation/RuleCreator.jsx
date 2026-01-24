import React, { useState } from 'react';
import { createModerationRule } from './ModerationAPI';

const RuleCreator = ({ media, onRuleCreated, onError, onBack }) => {
  const [keywords, setKeywords] = useState(['spam', 'hate']);
  const [newKeyword, setNewKeyword] = useState('');
  const [action, setAction] = useState('hide');
  const [ruleName, setRuleName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate rule name based on media caption
  React.useEffect(() => {
    if (!ruleName && media.caption) {
      const shortCaption = media.caption.length > 30 
        ? media.caption.substring(0, 30) + '...' 
        : media.caption;
      setRuleName(`Moderate: ${shortCaption}`);
    }
  }, [media.caption, ruleName]);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim().toLowerCase())) {
      setKeywords([...keywords, newKeyword.trim().toLowerCase()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSubmit = async () => {
    if (keywords.length === 0) {
      onError('Please add at least one keyword');
      return;
    }

    if (!ruleName.trim()) {
      onError('Please enter a rule name');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const ruleData = {
        instagramMediaId: media.id,
        action: action,
        is_active: isActive,
        keywords: keywords,
        rule_name: ruleName // Optional, backend might use this
      };

      await createModerationRule(ruleData);
      
      onError(''); // Clear any previous errors
      onRuleCreated();
      
    } catch (error) {
      console.error('Error creating rule:', error);
      onError(`Failed to create rule: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rule-creator">
      {/* Header */}
      <div className="rule-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Media
        </button>
        <h2 className="rule-title">Create Moderation Rule</h2>
        <p className="rule-subtitle">
          Set up auto-moderation for comments on this post
        </p>
      </div>

      {/* Selected Media Preview */}
      <div className="selected-media-preview">
        <div className="media-preview-header">
          <h3>Selected Post:</h3>
          <span className="media-id">ID: {media.id}</span>
        </div>
        
        <div className="media-preview-content">
          {media.media_url && !media.media_url.includes('.mp4') ? (
            <img 
              src={media.media_url} 
              alt="Selected post"
              className="preview-image"
            />
          ) : (
            <div className="media-placeholder">
              <span className="placeholder-icon">📸</span>
              <p>Media Preview</p>
            </div>
          )}
          
          <div className="media-details">
            <p className="media-caption">
              {media.caption || 'No caption available'}
            </p>
            <div className="media-stats">
              <span className="stat">
                <span className="stat-icon">❤️</span>
                <span className="stat-value">{media.like_count || 0} likes</span>
              </span>
              <span className="stat">
                <span className="stat-icon">💬</span>
                <span className="stat-value">{media.comments_count || 0} comments</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rule Form */}
      <div className="rule-form">
        {/* Rule Name */}
        <div className="form-group">
          <label className="form-label">
            Rule Name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="e.g., Moderate vacation post comments"
            className="rule-name-input"
          />
          <p className="form-hint">
            Give your rule a descriptive name for easy identification
          </p>
        </div>

        {/* Keywords */}
        <div className="form-group">
          <label className="form-label">
            Keywords to Moderate <span className="required">*</span>
          </label>
          <div className="keywords-input-container">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a keyword and press Enter"
              className="keyword-input"
            />
            <button
              type="button"
              className="add-keyword-btn"
              onClick={handleAddKeyword}
              disabled={!newKeyword.trim()}
            >
              Add
            </button>
          </div>
          
          {/* Keywords List */}
          <div className="keywords-list">
            {keywords.length === 0 ? (
              <div className="no-keywords">
                <span className="no-keywords-icon">⚠️</span>
                <span className="no-keywords-text">No keywords added yet</span>
              </div>
            ) : (
              keywords.map((keyword, index) => (
                <div key={index} className="keyword-tag">
                  <span className="keyword-text">{keyword}</span>
                  <button
                    type="button"
                    className="remove-keyword"
                    onClick={() => handleRemoveKeyword(keyword)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
          
          <p className="form-hint">
            Add keywords that should trigger moderation. Comments containing these words will be auto-moderated.
          </p>
        </div>

        {/* Action Selection */}
        <div className="form-group">
          <label className="form-label">
            Action When Keyword Matches <span className="required">*</span>
          </label>
          <div className="action-buttons">
            <button
              type="button"
              className={`action-btn ${action === 'hide' ? 'active' : ''}`}
              onClick={() => setAction('hide')}
            >
              <span className="action-icon">👁️</span>
              <span className="action-title">Hide</span>
              <span className="action-desc">Comment hidden from public view</span>
            </button>
            
            <button
              type="button"
              className={`action-btn ${action === 'delete' ? 'active' : ''}`}
              onClick={() => setAction('delete')}
            >
              <span className="action-icon">🗑️</span>
              <span className="action-title">Delete</span>
              <span className="action-desc">Comment permanently removed</span>
            </button>
            
            <button
              type="button"
              className={`action-btn ${action === 'block' ? 'active' : ''}`}
              onClick={() => setAction('block')}
            >
              <span className="action-icon">🚫</span>
              <span className="action-title">Block User</span>
              <span className="action-desc">Block user + hide comment</span>
            </button>
          </div>
        </div>

        {/* Active Toggle */}
        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="toggle-input"
            />
            <span className="toggle-slider"></span>
            <span className="toggle-text">
              {isActive ? 'Rule is active' : 'Rule is inactive'}
            </span>
          </label>
          <p className="form-hint">
            Inactive rules won't moderate comments until enabled
          </p>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            className="cancel-btn"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || keywords.length === 0 || !ruleName.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner"></span>
                Creating Rule...
              </>
            ) : (
              'Create Moderation Rule'
            )}
          </button>
        </div>
      </div>

      {/* Rule Preview */}
      <div className="rule-preview">
        <h3>Rule Preview:</h3>
        <div className="preview-card">
          <p>
            <strong>When</strong> a comment on post "
            {media.caption ? (media.caption.length > 50 ? media.caption.substring(0, 50) + '...' : media.caption) : 'selected post'}"
            contains any of these keywords:
          </p>
          
          <div className="preview-keywords">
            {keywords.map((keyword, index) => (
              <span key={index} className="preview-keyword">{keyword}</span>
            ))}
          </div>
          
          <p>
            <strong>Then</strong> the comment will be{' '}
            <span className="action-highlight">
              {action === 'hide' ? 'hidden from public view' : 
               action === 'delete' ? 'permanently deleted' : 
               'deleted and user will be blocked'}
            </span>
          </p>
          
          <div className="preview-status">
            <span className={`status-indicator ${isActive ? 'active' : 'inactive'}`}>
              {isActive ? '● Active' : '○ Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleCreator;