import React, { useState, useEffect } from 'react';
import { getInstagramMedia, syncInstagramMedia } from './ModerationAPI';
import './ModerationComponents.css';
const MediaSelector = ({ onMediaSelect, onError }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const mediaData = await getInstagramMedia();
      setMedia(mediaData);
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
      await fetchMedia(); // Refresh media list after sync
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

  if (isLoading) {
    return (
      <div className="media-selector loading">
        <div className="loading-spinner"></div>
        <p>Loading your Instagram media...</p>
      </div>
    );
  }

  return (
    <div className="media-selector">
      {/* Header */}
      <div className="media-header">
        <h2 className="media-title">Select Instagram Post</h2>
        <p className="media-subtitle">
          Choose a post to set up comment moderation rules
        </p>
      </div>

      {/* Search and Actions */}
      <div className="media-actions">
        <div className="search-box">
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
          className="sync-btn"
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
      <div className="media-count">
        <span className="count-number">{filteredMedia.length}</span>
        <span className="count-text">posts found</span>
        {searchTerm && (
          <span className="search-hint">for "{searchTerm}"</span>
        )}
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="no-media">
          <div className="no-media-icon">📸</div>
          <h3>No posts found</h3>
          <p>
            {searchTerm 
              ? 'No posts match your search. Try different keywords.'
              : 'Connect your Instagram account and start posting to see media here.'
            }
          </p>
          {!searchTerm && (
            <button className="sync-btn" onClick={handleSyncMedia}>
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
                <div className="media-thumbnail">
                  {mediaItem.media_url ? (
                    mediaItem.media_url.includes('.mp4') || mediaItem.type === 'VIDEO' ? (
                      <div className="video-thumbnail">
                        <span className="video-icon">🎬</span>
                        <p>Video</p>
                      </div>
                    ) : (
                      <img 
                        src={mediaItem.media_url} 
                        alt={mediaItem.caption || 'Instagram post'}
                        className="media-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="image-error">📸</div>';
                        }}
                      />
                    )
                  ) : (
                    <div className="no-thumbnail">
                      <span className="placeholder-icon">📸</span>
                    </div>
                  )}
                </div>
                
                <div className="media-info">
                  <p className="media-caption">
                    {mediaItem.caption 
                      ? (mediaItem.caption.length > 100 
                          ? mediaItem.caption.substring(0, 100) + '...' 
                          : mediaItem.caption)
                      : 'No caption'
                    }
                  </p>
                  
                  <div className="media-stats">
                    <span className="stat-item">
                      <span className="stat-icon">❤️</span>
                      <span className="stat-value">{mediaItem.like_count || 0}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">💬</span>
                      <span className="stat-value">{mediaItem.comments_count || 0}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">📅</span>
                      <span className="stat-value">
                        {mediaItem.timestamp 
                          ? new Date(mediaItem.timestamp).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="media-selector-check">
                  {selectedMediaId === mediaItem.id && (
                    <span className="check-icon">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selection Actions */}
          <div className="selection-actions">
            <div className="selection-info">
              {selectedMediaId ? (
                <>
                  <span className="selected-icon">✓</span>
                  <span className="selected-text">Post selected</span>
                </>
              ) : (
                <span className="select-hint">Click on a post to select it</span>
              )}
            </div>
            
            <button
              className="continue-btn"
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