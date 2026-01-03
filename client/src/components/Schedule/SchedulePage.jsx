import React, { useState, useEffect, useRef } from 'react';
import './SchedulePage.css';

const SchedulePage = () => {
  const [user, setUser] = useState(null);
  const [instagramInfo, setInstagramInfo] = useState(null);
  const [isLoading, setIsLoading] = useState({
    info: false,
    caption: false,
    schedule: false,
    oauth: false
  });
  const [formData, setFormData] = useState({
    postType: '',
    caption: '',
    captionContext: '',
    scheduledAt: '',
    mediaFile: null
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [messages, setMessages] = useState({
    success: '',
    error: '',
    info: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
  // Check authentication
  const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
  const userData = localStorage.getItem('auth_user') || localStorage.getItem('authUser');
  
  if (!token || !userData) {
    window.location.href = '/login';
    return;
  }

  try {
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // ⬇️ CHECK FOR INSTAGRAM SUCCESS PARAMETER
    const urlParams = new URLSearchParams(window.location.search);
    const igStatus = urlParams.get('ig');
    
    if (igStatus === 'success') {
      // Instagram OAuth completed successfully
      setMessages(prev => ({ 
        ...prev, 
        success: '✅ Instagram connected successfully!',
        error: ''
      }));
      
      // Fetch Instagram info automatically
      fetchInstagramInfo(parsedUser);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessages(prev => ({ ...prev, success: '' }));
      }, 5000);
      
      // Remove parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } 
    else if (igStatus === 'error') {
      // Instagram OAuth failed
      setMessages(prev => ({ 
        ...prev, 
        error: '❌ Instagram connection failed. Please try again.',
        success: ''
      }));
      
      // Remove parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    else {
      // Normal load - fetch Instagram info if available
      fetchInstagramInfo(parsedUser);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    window.location.href = '/login';
  }
}, []);

  // Handle OAuth Callback
  const handleOAuthCallback = async (code, state, userData) => {
    setIsLoading(prev => ({ ...prev, oauth: true }));
    setMessages(prev => ({ 
      ...prev, 
      info: 'Connecting Instagram account...',
      error: '',
      success: ''
    }));

    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
      
      // Send code to backend for token exchange
      const response = await fetch('https://auth.clashhub.online/api/instagram/exchange-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          state,
          user_id: userData.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setMessages(prev => ({ 
            ...prev, 
            success: '✅ Instagram connected successfully!',
            info: ''
          }));
          
          // Fetch updated Instagram info
          fetchInstagramInfo(userData);
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            setMessages(prev => ({ ...prev, success: '' }));
          }, 5000);
        } else {
          throw new Error(data.message || 'Instagram connection failed');
        }
      } else {
        throw new Error('Failed to exchange OAuth code');
      }
    } catch (error) {
      setMessages(prev => ({ 
        ...prev, 
        error: `Failed to connect Instagram: ${error.message}`,
        info: ''
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, oauth: false }));
    }
  };

  const fetchInstagramInfo = async (userData) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
    if (!token || !userData?.id) return;

    setIsLoading(prev => ({ ...prev, info: true }));
    setMessages(prev => ({ ...prev, info: 'Loading Instagram info...' }));

    try {
      // Real API call - matches your HTML format
      const response = await fetch(
        `https://auth.clashhub.online/api/instagram/getuser?user_id=${encodeURIComponent(userData.id)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInstagramInfo(data);
        setMessages(prev => ({ ...prev, info: '' }));
      } else {
        throw new Error(`Request failed: ${response.status}`);
      }
    } catch (error) {
      setMessages(prev => ({ 
        ...prev, 
        info: '⚠️ Could not load Instagram info' 
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, info: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setMessages(prev => ({ 
        ...prev, 
        error: 'Please upload only images (JPEG, PNG, GIF) or videos (MP4, MOV)' 
      }));
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setMessages(prev => ({ 
        ...prev, 
        error: 'File size too large. Maximum 50MB allowed' 
      }));
      return;
    }

    setFormData(prev => ({ ...prev, mediaFile: file }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    setMessages(prev => ({ ...prev, error: '' }));
  };

  const handleGenerateCaption = async () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
    if (!token) return;

    setIsLoading(prev => ({ ...prev, caption: true }));
    setMessages(prev => ({ ...prev, error: '', success: '' }));

    try {
      // Real API call - matches your HTML format
      const response = await fetch('https://auth.clashhub.online/api/ai/generate-caption', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: formData.captionContext,
          postType: formData.postType || 'image',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ 
          ...prev, 
          caption: data.caption || '' 
        }));
        setMessages(prev => ({ 
          ...prev, 
          success: '✨ Caption generated successfully!' 
        }));
      } else {
        throw new Error('Failed to generate caption');
      }
    } catch (error) {
      setMessages(prev => ({ 
        ...prev, 
        error: 'Failed to generate caption. Please try again.' 
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, caption: false }));
    }
  };

  const handleSchedulePost = async () => {
    // Validation
    if (!formData.postType) {
      setMessages(prev => ({ ...prev, error: 'Please select post type' }));
      return;
    }

    if (!formData.mediaFile) {
      setMessages(prev => ({ ...prev, error: 'Please upload a media file' }));
      return;
    }

    const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
    if (!token || !user?.id) return;

    setIsLoading(prev => ({ ...prev, schedule: true }));
    setMessages(prev => ({ ...prev, error: '', success: '' }));

    try {
      // Create FormData - matches your HTML format EXACTLY
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', user.id);
      formDataToSend.append('post_type', formData.postType);
      formDataToSend.append('media', formData.mediaFile);
      if (formData.caption) formDataToSend.append('caption', formData.caption);
      if (formData.scheduledAt) {
        formDataToSend.append(
          'scheduled_at',
          new Date(formData.scheduledAt).toISOString()
        );
      }

      // Real API call - matches your HTML format
      const response = await fetch('https://auth.clashhub.online/api/instagram/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Success - reset form and show success message
        setFormData({
          postType: '',
          caption: '',
          captionContext: '',
          scheduledAt: '',
          mediaFile: null
        });
        setMediaPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        const scheduleMsg = formData.scheduledAt 
          ? `✅ Post scheduled for ${new Date(formData.scheduledAt).toLocaleString()}`
          : '✅ Post scheduled for immediate publishing';
        
        setMessages(prev => ({ 
          ...prev, 
          success: scheduleMsg,
          error: ''
        }));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }
    } catch (error) {
      setMessages(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to schedule post',
        success: ''
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, schedule: false }));
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessages(prev => ({ ...prev, success: '' }));
      }, 5000);
    }
  };

  const handleRemoveMedia = () => {
    setFormData(prev => ({ ...prev, mediaFile: null }));
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Format date for datetime-local input
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10); // Minimum 10 minutes from now
    return now.toISOString().slice(0, 16);
  };

  if (!user) {
    return (
      <div className="schedule-loading">
        <div className="loading-spinner"></div>
        <p>Loading schedule page...</p>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      {/* Animated Background */}
      <div className="schedule-bg"></div>
      
      {/* OAuth Loading Overlay */}
      {isLoading.oauth && (
        <div className="oauth-loading-overlay">
          <div className="oauth-loading-content">
            <div className="oauth-spinner"></div>
            <h3>Connecting Instagram...</h3>
            <p>Please wait while we connect your account</p>
          </div>
        </div>
      )}
      
      {/* Main Card */}
      <div className="schedule-card">
        {/* Header */}
        <div className="schedule-header">
          <div className="schedule-logo">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <radialGradient id="instagram-gradient" cx="19.38" cy="42.035" r="44.896">
                <stop offset="0" stopColor="#fd5"/>
                <stop offset=".328" stopColor="#ff543e"/>
                <stop offset=".348" stopColor="#fc5245"/>
                <stop offset=".504" stopColor="#e64771"/>
                <stop offset=".643" stopColor="#d53e91"/>
                <stop offset=".761" stopColor="#cc39a4"/>
                <stop offset=".841" stopColor="#c837ab"/>
              </radialGradient>
              <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </div>
          <h1 className="schedule-title">Schedule Instagram Post</h1>
          <p className="schedule-subtitle">
            Create and schedule content for your connected Instagram account
          </p>
        </div>

        {/* Instagram Info Card */}
        <div className="info-card">
          <div className="info-header">
            <h3 className="info-title">Connected Account</h3>
            <button 
              className="refresh-btn"
              onClick={() => fetchInstagramInfo(user)}
              disabled={isLoading.info}
            >
              {isLoading.info ? '🔄 Loading...' : '🔄 Refresh'}
            </button>
          </div>
          
          {instagramInfo ? (
            <div className="info-content">
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className="info-value status-connected">✅ Connected</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account ID:</span>
                <span className="info-value">{instagramInfo.id || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">@{instagramInfo.username || 'username'}</span>
              </div>
            </div>
          ) : (
            <div className="info-loading">
              {messages.info || 'Loading Instagram account information...'}
            </div>
          )}
        </div>

        {/* Messages */}
        {messages.error && (
          <div className="message error-message">
            <span className="message-icon">⚠️</span>
            <span className="message-text">{messages.error}</span>
            <button 
              className="message-close"
              onClick={() => setMessages(prev => ({ ...prev, error: '' }))}
            >
              ✕
            </button>
          </div>
        )}

        {messages.success && (
          <div className="message success-message">
            <span className="message-icon">✅</span>
            <span className="message-text">{messages.success}</span>
            <button 
              className="message-close"
              onClick={() => setMessages(prev => ({ ...prev, success: '' }))}
            >
              ✕
            </button>
          </div>
        )}

        {/* Schedule Form */}
        <div className="schedule-form">
          {/* Post Type */}
          <div className="form-group">
            <label className="form-label">Post Type *</label>
            <div className="type-buttons">
              <button
                type="button"
                className={`type-btn ${formData.postType === 'image' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, postType: 'image' }))}
              >
                <span className="type-icon">📸</span>
                <span className="type-text">Story</span>
                <span className="type-desc">Image or short video (15s)</span>
              </button>
              <button
                type="button"
                className={`type-btn ${formData.postType === 'reel' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, postType: 'reel' }))}
              >
                <span className="type-icon">🎬</span>
                <span className="type-text">Reel</span>
                <span className="type-desc">Video (15-90s)</span>
              </button>
            </div>
          </div>

          {/* Media Upload */}
          <div className="form-group">
            <label className="form-label">Upload Media *</label>
            <div className="upload-area">
              {mediaPreview ? (
                <div className="media-preview">
                  {formData.postType === 'reel' || formData.mediaFile?.type?.startsWith('video/') ? (
                    <video src={mediaPreview} controls className="preview-video" />
                  ) : (
                    <img src={mediaPreview} alt="Preview" className="preview-image" />
                  )}
                  <button className="remove-media" onClick={handleRemoveMedia}>
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="upload-placeholder">
                    <span className="upload-icon">📁</span>
                    <p className="upload-text">Click to upload media file</p>
                    <p className="upload-hint">
                      {formData.postType === 'reel' 
                        ? 'MP4 or MOV, 15-90 seconds' 
                        : 'JPG, PNG, GIF, or MP4 (15s max)'}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="mediaFile"
                    accept={formData.postType === 'reel' ? 'video/*' : 'image/*,video/*'}
                    onChange={handleFileChange}
                    className="file-input"
                  />
                </>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="form-group">
            <label className="form-label">Caption</label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Enter caption or generate with AI..."
              className="caption-input"
              rows="4"
            />
          </div>

          {/* AI Caption Generation */}
          <div className="form-group">
            <label className="form-label">AI Caption Generator</label>
            <input
              type="text"
              name="captionContext"
              value={formData.captionContext}
              onChange={handleInputChange}
              placeholder="e.g., travel, startup launch, fitness, motivation"
              className="context-input"
            />
            <button
              className="ai-generate-btn"
              onClick={handleGenerateCaption}
              disabled={isLoading.caption || !formData.postType}
            >
              {isLoading.caption ? (
                <>
                  <span className="ai-spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  <span className="ai-icon">✨</span>
                  Generate Caption with AI
                </>
              )}
            </button>
            <p className="ai-hint">
              Provide context for better AI-generated captions
            </p>
          </div>

          {/* Schedule Time */}
          <div className="form-group">
            <label className="form-label">Schedule Time (Optional)</label>
            <div className="datetime-input">
              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleInputChange}
                min={getMinDateTime()}
                className="datetime-field"
              />
              <button
                type="button"
                className="clear-datetime"
                onClick={() => setFormData(prev => ({ ...prev, scheduledAt: '' }))}
              >
                Clear
              </button>
            </div>
            <p className="datetime-hint">
              Leave empty to post immediately, or schedule for later
            </p>
          </div>

          {/* Schedule Button */}
          <button
            className="schedule-post-btn"
            onClick={handleSchedulePost}
            disabled={isLoading.schedule || !formData.postType || !formData.mediaFile}
          >
            {isLoading.schedule ? (
              <>
                <span className="btn-spinner"></span>
                Scheduling...
              </>
            ) : (
              'Schedule Post'
            )}
          </button>

          {/* Requirements */}
          <div className="requirements">
            <h4 className="requirements-title">Requirements:</h4>
            <ul className="requirements-list">
              <li>• Select post type (Story or Reel)</li>
              <li>• Upload one media file</li>
              <li>• Story: Image or video under 15 seconds</li>
              <li>• Reel: MP4/MOV, 9:16 aspect ratio, 15-90 seconds</li>
              <li>• Caption is optional but recommended</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;