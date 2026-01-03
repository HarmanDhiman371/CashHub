import React, { useEffect } from 'react';

const TestCallback = () => {
  useEffect(() => {
    // Simulate OAuth callback with test parameters
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform') || 'instagram';
    
    // Create realistic test data
    const testCode = 'AQB' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const testState = btoa(JSON.stringify({ 
      user_id: '1', 
      ts: Date.now(),
      platform: platform
    }));
    
    // Get user data from localStorage
    const userData = localStorage.getItem('authUser');
    let userId = '1';
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        userId = parsedUser.id || '1';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // Update state with actual user ID
    const finalState = btoa(JSON.stringify({ 
      user_id: userId, 
      ts: Date.now(),
      platform: platform
    }));
    
    console.log(`Test ${platform} OAuth callback:`);
    console.log('Code:', testCode);
    console.log('State:', finalState);
    
    // Redirect to schedule page with test parameters
    setTimeout(() => {
      window.location.href = `/schedule?code=${testCode}&state=${encodeURIComponent(finalState)}&platform=${platform}`;
    }, 1500); // 1.5 second delay to show loading screen
    
  }, []);

  return (
    <div className="test-callback-container">
      <div className="test-callback-content">
        <div className="callback-spinner"></div>
        <h2>Test OAuth Callback</h2>
        <p>Simulating {new URLSearchParams(window.location.search).get('platform') || 'Instagram'} authentication...</p>
        <p className="callback-note">This is a development simulation. In production, this would be handled by your backend.</p>
      </div>
    </div>
  );
};

export default TestCallback;