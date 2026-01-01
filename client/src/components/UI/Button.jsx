import React from 'react';
//import './Button.css';

const Button = ({ children, variant = 'primary', fullWidth = false, isLoading = false, ...props }) => {
  return (
    <button
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${isLoading ? 'loading' : ''}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="spinner"></span>
          Loading...
        </>
      ) : children}
    </button>
  );
};

export default Button;