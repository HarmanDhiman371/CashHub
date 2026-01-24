// API calls for Instagram comment moderation

const API_BASE = 'https://auth.clashhub.online/api';

/**
 * Fetch Instagram media for the authenticated user
 * @returns {Promise} Array of media objects
 */
export const getInstagramMedia = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_BASE}/instagram/getMedia`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.message || 'Failed to fetch media');
    }
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    throw error;
  }
};

/**
 * Create a comment moderation rule
 * @param {Object} ruleData - Rule configuration
 * @returns {Promise} Created rule data
 */
export const createModerationRule = async (ruleData) => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_BASE}/comments/moderation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ruleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create rule: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data || data;
    } else {
      throw new Error(data.message || 'Failed to create moderation rule');
    }
  } catch (error) {
    console.error('Error creating moderation rule:', error);
    throw error;
  }
};

/**
 * Fetch moderated comments logs
 * @param {number} limit - Number of logs to fetch
 * @returns {Promise} Array of moderated comments
 */
export const getModeratedComments = async (limit = 50) => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token found');

  try {
    const userData = localStorage.getItem('auth_user');
    const user = userData ? JSON.parse(userData) : null;
    
    if (!user || !user.id) {
      throw new Error('User data not found');
    }

    const response = await fetch(
      `${API_BASE}/instagram/getModeratedComments?user_id=${user.id}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch moderated comments: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.message || 'Failed to fetch moderated comments');
    }
  } catch (error) {
    console.error('Error fetching moderated comments:', error);
    throw error;
  }
};

/**
 * Sync Instagram media (refresh media list)
 * @returns {Promise} Sync result
 */
export const syncInstagramMedia = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_BASE}/instagram/mediaSync`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to sync media: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error syncing Instagram media:', error);
    throw error;
  }
};