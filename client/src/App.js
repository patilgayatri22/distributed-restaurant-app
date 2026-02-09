import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Content from './components/Content';
import Footer from './components/Footer';
import BookmarkModal from './components/BookmarkModal';
import Dashboard from './components/admin/Dashboard';
import axios from 'axios';

const App = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if there's a JWT token in localStorage when the app loads
    const token = localStorage.getItem('token');
    if (token) {
      // axios.get('http://localhost:8081/api/users/me', {  // Example endpoint to get user info
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      //   .then(response => setUser(response.data))  // Assuming response contains user data
      //   .catch(() => logout());  // If there's an error, log out the user
    }
  }, []);

  const addBookmark = (item) => {
    setBookmarks([...bookmarks, item]);
  };

  // Open login modal
  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  // Close login modal
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Open register modal
  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  // Close register modal
  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  // Handle login (set JWT in localStorage)
  const login = (token, is_admin) => {
    localStorage.setItem('token', token);
    setUser({ token, is_admin });
    closeLoginModal();
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = 'http://localhost:9000'; 
  };

  const handleSearch = (queryParams) => {
    setSearchQuery(queryParams);  // Update the searchQuery state with the queryParams passed from Navbar
  };

  return (
    <Router>
      <div>
        <Header openLoginModal={openLoginModal} openRegisterModal={openRegisterModal} logout={logout} user={user} />
        <Navbar addBookmark={addBookmark} onSearch={handleSearch} />

        {/* Routes for dynamic content */}
        <Routes>
          <Route path="/:category/:subcategory" element={<Content searchQuery={searchQuery} />} />
          <Route path="/" element={<h2>Welcome to the Home Page</h2>} />
          <Route path="/dashboard" element={<Dashboard />} /> 
        </Routes>

        {/* Bookmark Modal */}
        <BookmarkModal bookmarks={bookmarks} />

        {/* Login Modal */}
        {showLoginModal && (
          <div style={modalBackdropStyle}>
            <div style={modalContentStyle}>
              <h2>Login</h2>
              <LoginForm login={login} />
              <button onClick={closeLoginModal}>Close</button>
            </div>
          </div>
        )}

        {/* Register Modal */}
        {showRegisterModal && (
          <div style={modalBackdropStyle}>
            <div style={modalContentStyle}>
              <h2>Register</h2>
              <RegistrationForm />
              <button onClick={closeRegisterModal}>Close</button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </Router>
  );
};

// Styles for the modal backdrop and content
const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  maxWidth: '500px',
  width: '100%',
};

export default App;
