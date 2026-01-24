import React, { useState, useEffect } from 'react';
import { getInstagramMedia, syncInstagramMedia } from './ModerationAPI';
import './MediaSelector.css';

const MediaSelector = ({ onMediaSelect, onError }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const mediaData = await getInstagramMedia();
      setMedia(Array.isArray(mediaData) ? mediaData : []);
      onError('');
    } catch (error) {
      console.error('Error fetching media:', error);
      onError('Failed to load Instagram media. Please try again.');
      setMedia([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncMedia = async () => {
    try {
      setIsSyncing(true);
      await syncInstagramMedia();
      await fetchMedia();
      onError('');
    } catch (error) {
      console.error('Error syncing media:', error);
      onError('Failed to sync media. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleMediaClick = (mediaItem) => {
    setSelectedMediaId(mediaItem.id);
  };

  const handleContinue = () => {
    const selected = media.find(m => m.id === selectedMediaId);
    if (selected) {
      onMediaSelect(selected);
    }
  };

  const filteredMedia = media.filter(mediaItem => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (mediaItem.caption && mediaItem.caption.toLowerCase().includes(searchLower)) ||
      (mediaItem.id && mediaItem.id.toLowerCase().includes(searchLower))
    );
  });

  const getMediaTypeIcon = (mediaItem) => {
    if (mediaItem.type === 'VIDEO' || (mediaItem.media_url && mediaItem.media_url.includes('.mp4'))) {
      return '🎬';
    } else if (mediaItem.type === 'CAROUSEL_ALBUM') {
      return '🖼️';
    } else {
      return '📸';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="media-selector-loading">
        <div className="loading-spinner"></div>
        <p>Loading your Instagram media...</p>
      </div>
    );
  }

  return (
    <div className="media-selector">
      {/* Header */}
      <div className="media-selector-header">
        <h2 className="media-selector-title">Select Instagram Post</h2>
        <p className="media-selector-subtitle">
          Choose a post to set up comment moderation rules
        </p>
      </div>

      {/* Search and Actions */}
      <div className="media-selector-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts by caption..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <button
          className="sync-media-btn"
          onClick={handleSyncMedia}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <>
              <span className="btn-spinner"></span>
              Syncing...
            </>
          ) : (
            '🔄 Sync Media'
          )}
        </button>
      </div>

      {/* Media Count */}
      <div className="media-stats">
        <span className="media-count">
          {filteredMedia.length} {filteredMedia.length === 1 ? 'post' : 'posts'} found
        </span>
        {searchTerm && (
          <span className="search-filter">for "{searchTerm}"</span>
        )}
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="no-media-found">
          <div className="no-media-icon">📸</div>
          <h3>No posts found</h3>
          <p>
            {searchTerm 
              ? 'No posts match your search. Try different keywords.'
              : 'Connect your Instagram account and start posting to see media here.'
            }
          </p>
          {!searchTerm && (
            <button className="sync-media-btn large" onClick={handleSyncMedia}>
              🔄 Sync Instagram Media
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="media-grid">
            {filteredMedia.map((mediaItem) => (
              <div
                key={mediaItem.id}
                className={`media-card ${selectedMediaId === mediaItem.id ? 'selected' : ''}`}
                onClick={() => handleMediaClick(mediaItem)}
              >
                <div className="media-card-header">
                  <span className="media-type-icon">{getMediaTypeIcon(mediaItem)}</span>
                  <span className="media-date">{formatDate(mediaItem.timestamp)}</span>
                </div>
                
                <div className="media-thumbnail">
                  {mediaItem.media_url && !mediaItem.media_url.includes('.mp4') ? (
                    <img 
                      src={mediaItem.media_url} 
                      alt={mediaItem.caption || 'Instagram post'}
                      className="media-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="media-fallback">📸</div>';
                      }}
                    />
                  ) : (
                    <div className="media-fallback">
                      {getMediaTypeIcon(mediaItem)}
                    </div>
                  )}
                  
                  {selectedMediaId === mediaItem.id && (
                    <div className="selected-overlay">
                      <span className="checkmark">✓</span>
                    </div>
                  )}
                </div>
                
                <div className="media-card-content">
                  <p className="media-caption">
                    {mediaItem.caption 
                      ? (mediaItem.caption.length > 100 
                          ? mediaItem.caption.substring(0, 100) + '...' 
                          : mediaItem.caption)
                      : 'No caption'
                    }
                  </p>
                  
                  <div className="media-engagement">
                    <span className="engagement-item">
                      <span className="engagement-icon">❤️</span>
                      <span className="engagement-count">{mediaItem.like_count || 0}</span>
                    </span>
                    <span className="engagement-item">
                      <span className="engagement-icon">💬</span>
                      <span className="engagement-count">{mediaItem.comments_count || 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Actions */}
          <div className="selection-actions">
            <div className="selection-status">
              {selectedMediaId ? (
                <>
                  <span className="status-icon selected">✓</span>
                  <span className="status-text">Post selected</span>
                </>
              ) : (
                <span className="status-text">Click on a post to select it</span>
              )}
            </div>
            
            <button
              className="continue-button"
              onClick={handleContinue}
              disabled={!selectedMediaId}
            >
              Continue to Create Rule →
            </button>
          </div>
        </>
      )}

      {/* Instructions */}
      <div className="media-instructions">
        <h4>How it works:</h4>
        <ol className="instructions-list">
          <li>Select an Instagram post from your media library</li>
          <li>Create moderation rules with specific keywords</li>
          <li>Comments containing those keywords will be auto-moderated</li>
          <li>Review moderation logs in the dashboard</li>
        </ol>
      </div>
    </div>
  );
};

export default MediaSelector;