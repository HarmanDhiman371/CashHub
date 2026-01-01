import React from 'react';
//import './Card.css';

const Card = ({ children, className = '', variant = 'default' }) => {
  return (
    <div className={`card card-${variant} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardBody = ({ children, className }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);

export default Card;