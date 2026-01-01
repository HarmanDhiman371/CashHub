import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import AuthLayout from '../Layout/AuthLayout';
import AuthForm from './AuthForm';
import { Link } from 'react-router-dom';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loginFields = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
      required: true
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true
    }
  ];

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const credentials = {
        email: formData.email,
        password: formData.password
      };

      const response = await authAPI.loginUser(credentials);
      
      if (response.success) {
        setSuccessMessage('Login successful! Redirecting...');
        
        // ⬇️ UPDATE THESE LINES - Store user data properly for ConnectionPage
        localStorage.setItem('authToken', response.token || 'dummy-token');
        
        // Store complete user object that ConnectionPage needs
        localStorage.setItem('authUser', JSON.stringify({
          id: response.user?.id || '1',
          username: response.user?.username || 'User',
          email: formData.email
        }));
        
        // ⬇️ CHANGE REDIRECT FROM '/dashboard' TO '/connections'
        setTimeout(() => {
          window.location.href = '/connections';
        }, 1500);
      } else {
        setErrorMessage(response.message || 'Invalid credentials');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue to ClashHub"
    >
      <div className="auth-content">
        <AuthForm
          title="Login"
          onSubmit={handleLogin}
          fields={loginFields}
          submitText="Sign In"
          isLoading={isLoading}
          successMessage={successMessage}
          errorMessage={errorMessage}
          onClearMessage={() => {
            setSuccessMessage('');
            setErrorMessage('');
          }}
        />
        
        <div className="auth-links">
          <div className="auth-link-group">
            <Link to="/forgot-password" className="auth-link">
              Forgot Password?
            </Link>
            <p className="auth-link-text">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;