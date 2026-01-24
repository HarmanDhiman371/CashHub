// import React, { useEffect, useState } from 'react';
// import './ConnectionPage.css';

// const ConnectionPage = () => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState({ fb: false, ig: false });

//   useEffect(() => {
//     // Check authentication
//     const token = localStorage.getItem('authToken');
//     const userData = localStorage.getItem('authUser');

//     if (!token || !userData) {
//       window.location.href = '/login';
//       return;
//     }

//     try {
//       setUser(JSON.parse(userData));
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//       window.location.href = '/login';
//     }
//   }, []);

//   const handleFacebookConnect = () => {
//     if (!user) return;

//     setIsLoading(prev => ({ ...prev, fb: true }));

//     const fbState = btoa(
//       JSON.stringify({
//         user_id: user.id,
//         ts: Date.now(),
//       })
//     );

//     const clientId = "1663986604579432";
//     const redirectUri = "https://auth.clashhub.online/api/facebook/callback";
//     const scope = ["email", "public_profile", "pages_show_list", "instagram_basic"].join(",");

//     const oauthUrl =
//       "https://www.facebook.com/v19.0/dialog/oauth" +
//       "?client_id=" + clientId +
//       "&redirect_uri=" + encodeURIComponent(redirectUri) +
//       "&response_type=code" +
//       "&scope=" + scope +
//       "&state=" + fbState;

//     window.location.href = oauthUrl;
//   };

//   const handleInstagramConnect = () => {
//     if (!user) return;

//     setIsLoading(prev => ({ ...prev, ig: true }));

//     const igState = btoa(
//       JSON.stringify({
//         user_id: user.id,
//         ts: Date.now(),
//       })
//     );

//     const IG_CLIENT_ID = "1711263866705770";
//     const IG_REDIRECT_URI = "https://auth.clashhub.online/api/instagram/callback";
//     const IG_SCOPE = [
//       "instagram_business_basic",
//       "instagram_business_manage_messages",
//       "instagram_business_manage_comments",
//       "instagram_business_content_publish",
//       "instagram_business_manage_insights",
//     ].join(",");

//     const oauthUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true` +
//                      `&client_id=${IG_CLIENT_ID}` +
//                      `&redirect_uri=${encodeURIComponent(IG_REDIRECT_URI)}` +
//                      `&response_type=code` +
//                      `&scope=${encodeURIComponent(IG_SCOPE)}` +
//                      `&state=${encodeURIComponent(igState)}`;

//     window.location.href = oauthUrl;
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('authUser');
//     window.location.href = '/login';
//   };

//   if (!user) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading platform...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="connection-container">
//       {/* Animated Background */}
//       <div className="connection-bg"></div>

//       {/* Main Card */}
//       <div className="connection-card">
//         {/* Header */}
//         <div className="connection-header">
//           <div className="platform-logo">CH</div>
//           <h1 className="platform-title">ClashHub Platform</h1>
//           <p className="platform-subtitle">Connect your social accounts to get started</p>
//         </div>

//         {/* User Info */}
//         <div className="user-info-card">
//           <div className="user-avatar">
//             {user.username?.charAt(0).toUpperCase() || 'U'}
//           </div>
//           <div className="user-details">
//             <h3 className="user-name">{user.username}</h3>
//             <p className="user-email">{user.email}</p>
//             <div className="user-status">
//               <span className="status-dot"></span>
//               <span>Connected</span>
//             </div>
//           </div>
//         </div>

//         {/* Connection Cards */}
//         <div className="connections-grid">
//           {/* Facebook Card */}
//           <div className="connection-item facebook-card">
//             <div className="connection-icon">
//               <svg viewBox="0 0 24 24" width="28" height="28">
//                 <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//               </svg>
//             </div>
//             <div className="connection-content">
//               <h3 className="connection-title">Facebook Business</h3>
//               <p className="connection-desc">
//                 Connect your Facebook Business account to manage pages and insights
//               </p>
//             </div>
//             <button 
//               className="connection-btn facebook-btn"
//               onClick={handleFacebookConnect}
//               disabled={isLoading.fb}
//             >
//               {isLoading.fb ? (
//                 <>
//                   <span className="btn-spinner"></span>
//                   Connecting...
//                 </>
//               ) : (
//                 'Login with Facebook'
//               )}
//             </button>
//           </div>

//           {/* Instagram Card */}
//           <div className="connection-item instagram-card">
//             <div className="connection-icon">
//               <svg viewBox="0 0 24 24" width="28" height="28">
//                 <radialGradient id="instagram-gradient" cx="19.38" cy="42.035" r="44.896" gradientUnits="userSpaceOnUse">
//                   <stop offset="0" stopColor="#fd5"/>
//                   <stop offset=".328" stopColor="#ff543e"/>
//                   <stop offset=".348" stopColor="#fc5245"/>
//                   <stop offset=".504" stopColor="#e64771"/>
//                   <stop offset=".643" stopColor="#d53e91"/>
//                   <stop offset=".761" stopColor="#cc39a4"/>
//                   <stop offset=".841" stopColor="#c837ab"/>
//                 </radialGradient>
//                 <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
//               </svg>
//             </div>
//             <div className="connection-content">
//               <h3 className="connection-title">Instagram Business</h3>
//               <p className="connection-desc">
//                 Connect Instagram to publish content, manage comments and view insights
//               </p>
//             </div>
//             <button 
//               className="connection-btn instagram-btn"
//               onClick={handleInstagramConnect}
//               disabled={isLoading.ig}
//             >
//               {isLoading.ig ? (
//                 <>
//                   <span className="btn-spinner"></span>
//                   Connecting...
//                 </>
//               ) : (
//                 'Connect Instagram'
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Logout Button */}
//         <div className="logout-section">
//           <button className="logout-btn" onClick={handleLogout}>
//             <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//               <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z"/>
//             </svg>
//             Logout
//           </button>
//         </div>

//         {/* Footer */}
//         <div className="connection-footer">
//           <p className="footer-note">
//             Need help? <a href="#" className="help-link">Contact Support</a>
//           </p>
//           <p className="footer-copyright">
//             © {new Date().getFullYear()} ClashHub Platform. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConnectionPage;

import React, { useEffect, useState } from 'react';
import './ConnectionPage.css';

const ConnectionPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState({ fb: false, ig: false });

  useEffect(() => {
    // ✅ FIX: Check exactly like HTML platform.html
    const token = localStorage.getItem('auth_token'); // Changed from authToken
    const userData = localStorage.getItem('auth_user'); // Changed from authUser

    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      window.location.href = '/login';
    }
  }, []);

  const handleFacebookConnect = () => {
    if (!user) return;

    setIsLoading(prev => ({ ...prev, fb: true }));

    const fbState = btoa(
      JSON.stringify({
        user_id: user.id,
        ts: Date.now(),
      })
    );

    const clientId = "1663986604579432";
    const redirectUri = "https://auth.clashhub.online/api/facebook/callback";
    const scope = ["email", "public_profile", "pages_show_list", "instagram_basic"].join(",");

    const oauthUrl =
      "https://www.facebook.com/v19.0/dialog/oauth" +
      "?client_id=" + clientId +
      "&redirect_uri=" + encodeURIComponent(redirectUri) +
      "&response_type=code" +
      "&scope=" + scope +
      "&state=" + fbState;

    window.location.href = oauthUrl;
  };

  const handleInstagramConnect = () => {
    if (!user) return;

    setIsLoading(prev => ({ ...prev, ig: true }));

    const igState = btoa(
      JSON.stringify({
        user_id: user.id,
        ts: Date.now(),
      })
    );

    const IG_CLIENT_ID = "1711263866705770";
    const IG_REDIRECT_URI = "https://auth.clashhub.online/api/instagram/callback";
    const IG_SCOPE = [
      "instagram_business_basic",
      "instagram_business_manage_messages",
      "instagram_business_manage_comments",
      "instagram_business_content_publish",
      "instagram_business_manage_insights",
    ].join(",");

    const oauthUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true` +
      `&client_id=${IG_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(IG_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(IG_SCOPE)}` +
      `&state=${encodeURIComponent(igState)}`;

    window.location.href = oauthUrl;
  };

  const handleLogout = () => {
    // ✅ FIX: Remove exactly like HTML version
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading platform...</p>
      </div>
    );
  }

  return (
    <div className="connection-container">
      {/* Animated Background */}
      <div className="connection-bg"></div>

      {/* Main Card */}
      <div className="connection-card">
        {/* Header */}
        <div className="connection-header">
          <div className="platform-logo">CH</div>
          <h1 className="platform-title">ClashHub Platform</h1>
          <p className="platform-subtitle">Connect your social accounts to get started</p>
        </div>

        {/* User Info - Match HTML display */}
        <div className="user-info-card">
          <div className="user-avatar">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h3 className="user-name">{user.username}</h3>
            <p className="user-email">{user.email}</p>
            <div className="user-status">
              <span className="status-dot"></span>
              <span>Connected</span>
            </div>
          </div>
        </div>

        {/* Connection Cards */}
        <div className="connections-grid">
          {/* Facebook Card */}
          <div className="connection-item facebook-card">
            <div className="connection-icon">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div className="connection-content">
              <h3 className="connection-title">Facebook Business</h3>
              <p className="connection-desc">
                Connect your Facebook Business account to manage pages and insights
              </p>
            </div>
            <button
              className="connection-btn facebook-btn"
              onClick={handleFacebookConnect}
              disabled={isLoading.fb}
            >
              {isLoading.fb ? (
                <>
                  <span className="btn-spinner"></span>
                  Connecting...
                </>
              ) : (
                'Login with Facebook'
              )}
            </button>
          </div>

          {/* Instagram Card */}
          <div className="connection-item instagram-card">
            <div className="connection-icon">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <radialGradient id="instagram-gradient" cx="19.38" cy="42.035" r="44.896" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#fd5" />
                  <stop offset=".328" stopColor="#ff543e" />
                  <stop offset=".348" stopColor="#fc5245" />
                  <stop offset=".504" stopColor="#e64771" />
                  <stop offset=".643" stopColor="#d53e91" />
                  <stop offset=".761" stopColor="#cc39a4" />
                  <stop offset=".841" stopColor="#c837ab" />
                </radialGradient>
                <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
            <div className="connection-content">
              <h3 className="connection-title">Instagram Business</h3>
              <p className="connection-desc">
                Connect Instagram to publish content, manage comments and view insights
              </p>
            </div>
            <button
              className="connection-btn instagram-btn"
              onClick={handleInstagramConnect}
              disabled={isLoading.ig}
            >
              {isLoading.ig ? (
                <>
                  <span className="btn-spinner"></span>
                  Connecting...
                </>
              ) : (
                'Connect Instagram'
              )}
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z" />
            </svg>
            Logout
          </button>
        </div>

        {/* Footer */}
        <div className="connection-footer">
          <p className="footer-note">
            Need help?<button className="help-link" onClick={() => alert('Support coming soon!')}>
              Contact Support
            </button>
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} ClashHub Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPage;