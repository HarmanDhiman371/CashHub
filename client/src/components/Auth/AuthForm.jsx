import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Alert from '../UI/Alert';

const AuthForm = ({ 
  title, 
  onSubmit, 
  fields, 
  submitText, 
  isLoading,
  successMessage,
  errorMessage,
  onClearMessage
}) => {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    fields.forEach(field => {
      initialData[field.name] = '';
    });
    return initialData;
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear messages when user types
    if (successMessage || errorMessage) {
      onClearMessage();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <Alert 
        type="success" 
        message={successMessage} 
        show={!!successMessage} 
        onClose={onClearMessage}
      />
      <Alert 
        type="error" 
        message={errorMessage} 
        show={!!errorMessage} 
        onClose={onClearMessage}
      />

      {fields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          type={field.type}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          placeholder={field.placeholder}
          error={errors[field.name]}
          required={field.required}
        />
      ))}

      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        isLoading={isLoading}
      >
        {submitText}
      </Button>
    </form>
  );
};

export default AuthForm;