import React from 'react';
//import './Alert.css';

const Alert = ({ type = 'info', message, onClose, show }) => {
  if (!show) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">
          {type === 'success' ? '✅' : 
           type === 'error' ? '❌' : 
           type === 'warning' ? '⚠️' : 'ℹ️'}
        </span>
        <span className="alert-message">{message}</span>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;