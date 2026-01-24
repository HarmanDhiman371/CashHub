// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Auth/Login';
// import Signup from './components/Auth/Signup';
// import ConnectionPage from './components/Platform/ConnectionPage';
// import SchedulePage from './components/Schedule/SchedulePage'; // ← NEW IMPORT
// import './styles/Auth.css';

// function App() {
//   const isAuthenticated = !!localStorage.getItem('auth_token') || !!localStorage.getItem('authToken');

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/connections"
//           element={
//             isAuthenticated ? <ConnectionPage /> : <Navigate to="/login" />
//           }
//         />
//         {/* NEW SCHEDULE ROUTE */}
//         <Route
//           path="/schedule"
//           element={
//             isAuthenticated ? <SchedulePage /> : <Navigate to="/login" />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ConnectionPage from "./components/Platform/ConnectionPage";
import SchedulePage from "./components/Schedule/SchedulePage";
import ModerationPage from "./components/Moderation/ModerationPage"; // ← NEW IMPORT
import "./styles/Auth.css";
import MainPage from "./components/MainPage/MainPage";

function App() {
  const isAuthenticated =
    !!localStorage.getItem("auth_token") && !!localStorage.getItem("auth_user");

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
        <Route
          path="/schedule"
          element={
            isAuthenticated ? <SchedulePage /> : <Navigate to="/login" />
          }
        />
        {/* NEW MODERATION ROUTE */}
        <Route
          path="/moderation"
          element={
            isAuthenticated ? <ModerationPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/main"
          element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
