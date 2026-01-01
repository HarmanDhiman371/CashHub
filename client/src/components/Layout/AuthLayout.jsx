import React, { useEffect, useRef } from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const createFloatingDot = () => {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--primary-red);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        animation: floatDot 4s linear forwards;
      `;
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      dot.style.left = `${x}%`;
      dot.style.top = `${y}%`;
      
      // Random animation delay
      dot.style.animationDelay = `${Math.random() * 2}s`;
      
      grid.appendChild(dot);
      
      // Remove after animation
      setTimeout(() => {
        if (dot.parentNode) {
          dot.parentNode.removeChild(dot);
        }
      }, 4000);
    };

    // Create initial dots
    for (let i = 0; i < 20; i++) {
      createFloatingDot();
    }

    // Create dots at intervals
    const interval = setInterval(createFloatingDot, 300);

    return () => clearInterval(interval);
  }, []);

  // Add CSS for floating dots
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatDot {
        0% {
          opacity: 0;
          transform: translateY(0) scale(1);
        }
        10% {
          opacity: 1;
          transform: translateY(-10px) scale(1.5);
        }
        90% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translateY(-100px) scale(0.5);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="auth-container">
      {/* Matrix Grid Background */}
      <div className="matrix-grid" ref={gridRef}></div>
      
      {/* Red Glow Effects */}
      <div className="glow-effect glow-1"></div>
      <div className="glow-effect glow-2"></div>
      <div className="glow-effect glow-3"></div>
      
      <div className="auth-card-wrapper">
        <div className="auth-header">
          <div className="auth-logo">CH</div>
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>
        {children}
        
        <div className="auth-footer">
          <p className="footer-text">
            © {new Date().getFullYear()} ClashHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;