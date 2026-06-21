import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Home/Dashboard';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import InterviewPrep from './pages/interviewprep/InterviewPrep';
import UserProvider from './context/userContext';

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
        </Routes>
      </Router>

      <Toaster 
      toastOptions={{
        className: '',
        style: {
          fontSize: '16px',
        },
      }}
      />
    </div>
    </UserProvider>
  )
}

export default App