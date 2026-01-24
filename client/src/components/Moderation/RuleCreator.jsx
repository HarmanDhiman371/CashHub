import React, { useState, useEffect } from 'react';
import { createModerationRule } from './ModerationAPI';
import './RulesCreator.css';

const RuleCreator = ({ media, onRuleCreated, onError, onBack }) => {
  const [keywords, setKeywords] = useState(['spam', 'hate', 'badword']);
  const [newKeyword, setNewKeyword] = useState('');
  const [action, setAction] = useState('hide');
  const [ruleName, setRuleName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!ruleName && media.caption) {
      const shortCaption = media.caption.length > 30 
        ? media.caption.substring(0, 30) + '...' 
        : media.caption;
      setRuleName(`Moderate: ${shortCaption}`);
    }
  }, [media.caption, ruleName]);

  const handleAddKeyword = () => {
    const trimmedKeyword = newKeyword.trim().toLowerCase();
    if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
      setKeywords([...keywords, trimmedKeyword]);
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
        rule_name: ruleName.trim()
      };

      await createModerationRule(ruleData);
      
      onError('');
      onRuleCreated();
      
    } catch (error) {
      console.error('Error creating rule:', error);
      onError(`Failed to create rule: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionDetails = (actionType) => {
    switch (actionType) {
      case 'hide':
        return { icon: '👁️', title: 'Hide', description: 'Comment hidden from public view' };
      case 'delete':
        return { icon: '🗑️', title: 'Delete', description: 'Comment permanently removed' };
      case 'block':
        return { icon: '🚫', title: 'Block User', description: 'Block user + hide comment' };
      default:
        return { icon: '⚙️', title: 'Custom', description: 'Custom action' };
    }
  };

  const actionDetails = getActionDetails(action);

  return (
    <div className="rule-creator">
      {/* Header */}
      <div className="rule-creator-header">
        <button className="rule-back-btn" onClick={onBack}>
          ← Back to Media
        </button>
        <h2 className="rule-creator-title">Create Moderation Rule</h2>
        <p className="rule-creator-subtitle">
          Set up auto-moderation for comments on this post
        </p>
      </div>

      {/* Selected Media Preview */}
      <div className="selected-media-section">
        <div className="media-section-header">
          <h3>Selected Post</h3>
          <span className="media-id-label">ID: {media.id}</span>
        </div>
        
        <div className="media-preview">
          {media.media_url && !media.media_url.includes('.mp4') ? (
            <img 
              src={media.media_url} 
              alt="Selected post"
              className="media-preview-image"
            />
          ) : (
            <div className="media-preview-placeholder">
              <span className="placeholder-icon">
                {media.type === 'VIDEO' ? '🎬' : '📸'}
              </span>
              <p>Media Preview</p>
            </div>
          )}
          
          <div className="media-preview-details">
            <p className="media-preview-caption">
              {media.caption || 'No caption available'}
            </p>
            <div className="media-preview-stats">
              <span className="media-stat">
                <span className="stat-icon">❤️</span>
                <span className="stat-value">{media.like_count || 0} likes</span>
              </span>
              <span className="media-stat">
                <span className="stat-icon">💬</span>
                <span className="stat-value">{media.comments_count || 0} comments</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rule Form */}
      <div className="rule-form-section">
        {/* Rule Name */}
        <div className="form-field">
          <label className="field-label">
            Rule Name <span className="required-star">*</span>
          </label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="e.g., Moderate vacation post comments"
            className="rule-name-field"
          />
          <p className="field-hint">
            Give your rule a descriptive name for easy identification
          </p>
        </div>

        {/* Keywords */}
        <div className="form-field">
          <label className="field-label">
            Keywords to Moderate <span className="required-star">*</span>
          </label>
          <div className="keyword-input-group">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a keyword and press Enter"
              className="keyword-input-field"
            />
            <button
              type="button"
              className="add-keyword-button"
              onClick={handleAddKeyword}
              disabled={!newKeyword.trim()}
            >
              Add
            </button>
          </div>
          
          {/* Keywords List */}
          <div className="keywords-container">
            {keywords.length === 0 ? (
              <div className="empty-keywords">
                <span className="empty-icon">⚠️</span>
                <span className="empty-text">No keywords added yet</span>
              </div>
            ) : (
              keywords.map((keyword, index) => (
                <div key={index} className="keyword-tag">
                  <span className="keyword-text">{keyword}</span>
                  <button
                    type="button"
                    className="remove-keyword-btn"
                    onClick={() => handleRemoveKeyword(keyword)}
                    aria-label={`Remove ${keyword}`}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
          
          <p className="field-hint">
            Add keywords that should trigger moderation. Comments containing these words will be auto-moderated.
          </p>
        </div>

        {/* Action Selection */}
        <div className="form-field">
          <label className="field-label">
            Action When Keyword Matches <span className="required-star">*</span>
          </label>
          <div className="action-selection">
            {['hide', 'delete', 'block'].map((actionType) => {
              const details = getActionDetails(actionType);
              return (
                <button
                  key={actionType}
                  type="button"
                  className={`action-option ${action === actionType ? 'selected' : ''}`}
                  onClick={() => setAction(actionType)}
                >
                  <span className="action-option-icon">{details.icon}</span>
                  <span className="action-option-title">{details.title}</span>
                  <span className="action-option-desc">{details.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Toggle */}
        <div className="form-field">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="toggle-checkbox"
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">
              {isActive ? 'Rule is active' : 'Rule is inactive'}
            </span>
          </label>
          <p className="field-hint">
            Inactive rules won't moderate comments until enabled
          </p>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            className="cancel-action-btn"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            className="submit-rule-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || keywords.length === 0 || !ruleName.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="submit-spinner"></span>
                Creating Rule...
              </>
            ) : (
              'Create Moderation Rule'
            )}
          </button>
        </div>
      </div>

      {/* Rule Preview */}
      <div className="rule-preview-section">
        <h3 className="preview-title">Rule Preview</h3>
        <div className="rule-preview-card">
          <p className="preview-text">
            <strong>When</strong> a comment on post "
            {media.caption ? (media.caption.length > 50 ? media.caption.substring(0, 50) + '...' : media.caption) : 'selected post'}"
            contains any of these keywords:
          </p>
          
          <div className="preview-keywords-list">
            {keywords.map((keyword, index) => (
              <span key={index} className="preview-keyword">{keyword}</span>
            ))}
          </div>
          
          <p className="preview-text">
            <strong>Then</strong> the comment will be{' '}
            <span className="highlighted-action">
              {actionDetails.description.toLowerCase()}
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