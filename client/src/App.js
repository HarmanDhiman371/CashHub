import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ConnectionPage from './components/Platform/ConnectionPage';
import './styles/Auth.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/connections" 
          element={
            isAuthenticated ? <ConnectionPage /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;