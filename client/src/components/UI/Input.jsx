import React, { useState } from 'react';
//import './Input.css';

const Input = ({ label, type = 'text', error, success, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`input-field ${error ? 'error' : ''} ${success ? 'success' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      {error && <span className="input-error">{error}</span>}
      {success && <span className="input-success">{success}</span>}
    </div>
  );
};

export default Input;