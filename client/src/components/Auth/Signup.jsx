// import React, { useState } from 'react';
// import { authAPI } from '../../services/api';
// import AuthLayout from '../Layout/AuthLayout';
// import AuthForm from './AuthForm';
// import { Link } from 'react-router-dom';

// const Signup = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const signupFields = [
//     {
//       name: 'username',
//       label: 'Username',
//       type: 'text',
//       placeholder: 'Enter your username',
//       required: true
//     },
//     {
//       name: 'email',
//       label: 'Email Address',
//       type: 'email',
//       placeholder: 'Enter your email',
//       required: true
//     },
//     {
//       name: 'password',
//       label: 'Password',
//       type: 'password',
//       placeholder: 'Create a strong password',
//       required: true
//     },
//     {
//       name: 'confirmPassword',
//       label: 'Confirm Password',
//       type: 'password',
//       placeholder: 'Confirm your password',
//       required: true
//     }
//   ];

//   const handleSignup = async (formData) => {
//     // Client-side validation
//     if (formData.password !== formData.confirmPassword) {
//       setErrorMessage('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setErrorMessage('Password must be at least 6 characters long');
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const userData = {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password
//       };

//       const response = await authAPI.createUser(userData);
      
//       if (response.success) {
//         setSuccessMessage('Account created successfully! Redirecting to login...');
//         // Clear form or redirect after delay
//         setTimeout(() => {
//           window.location.href = '/login';
//         }, 2000);
//       } else {
//         setErrorMessage(response.message || 'Signup failed. Please try again.');
//       }
//     } catch (error) {
//       setErrorMessage('Network error. Please check your connection.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AuthLayout 
//       title="Create Account" 
//       subtitle="Join ClashHub and start your journey"
//     >
//       <div className="auth-content">
//         <AuthForm
//           title="Sign Up"
//           onSubmit={handleSignup}
//           fields={signupFields}
//           submitText="Create Account"
//           isLoading={isLoading}
//           successMessage={successMessage}
//           errorMessage={errorMessage}
//           onClearMessage={() => {
//             setSuccessMessage('');
//             setErrorMessage('');
//           }}
//         />
        
//         <div className="auth-links">
//           <p className="auth-link-text">
//             Already have an account?{' '}
//             <Link to="/login" className="auth-link">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </AuthLayout>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import AuthLayout from '../Layout/AuthLayout';
import AuthForm from './AuthForm';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const signupFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true
    },
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
      placeholder: 'Create a strong password',
      required: true
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      required: true
    }
  ];

  const handleSignup = async (formData) => {
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await authAPI.createUser(userData);
      
      // ✅ FIX: Match HTML version check
      if (response.success !== false) { // HTML checks: data.success === false
        setSuccessMessage('Account created successfully! Redirecting to login...');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000); // Match HTML timing
      } else {
        setErrorMessage(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join ClashHub and start your journey"
    >
      <div className="auth-content">
        <AuthForm
          title="Sign Up"
          onSubmit={handleSignup}
          fields={signupFields}
          submitText="Create Account"
          isLoading={isLoading}
          successMessage={successMessage}
          errorMessage={errorMessage}
          onClearMessage={() => {
            setSuccessMessage('');
            setErrorMessage('');
          }}
        />
        
        <div className="auth-links">
          <p className="auth-link-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;