// ModerationAPI.js - Clean and optimized
const API_BASE = 'https://auth.clashhub.online/api';

export const getInstagramMedia = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_BASE}/instagram/getMedia`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Failed to fetch media: ${response.status}`);
    
    const data = await response.json();
    return data.success ? (data.data || []) : [];
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    throw error;
  }
};

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

    if (!response.ok) throw new Error(`Failed to create rule: ${response.status}`);
    
    const data = await response.json();
    return data.success ? (data.data || data) : null;
  } catch (error) {
    console.error('Error creating moderation rule:', error);
    throw error;
  }
};

export const getModeratedComments = async (limit = 50) => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token found');

  try {
    const userData = localStorage.getItem('auth_user');
    const user = userData ? JSON.parse(userData) : null;
    
    if (!user?.id) throw new Error('User data not found');

    const response = await fetch(
      `${API_BASE}/instagram/getModeratedComments?user_id=${user.id}&limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error(`Failed to fetch moderated comments: ${response.status}`);
    
    const data = await response.json();
    return data.success ? (data.data || []) : [];
  } catch (error) {
    console.error('Error fetching moderated comments:', error);
    throw error;
  }
};

export const syncInstagramMedia = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_BASE}/instagram/mediaSync`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Failed to sync media: ${response.status}`);
    
    return await response.json();
  } catch (error) {
    console.error('Error syncing Instagram media:', error);
    throw error;
  }
};