import React from 'react';
import { Link } from 'react-router-dom'; // To create navigation links

const Header = ({ openLoginModal, openRegisterModal, logout, user }) => {
  return (
    <header className="bg-dark text-white p-3" style={headerStyle}>
      <div style={headerContentStyle}>
        <h1 style={{ margin: 0 }}>The Pacific Window</h1>

        {/* Buttons positioned to the top-right */}
        <div style={buttonContainerStyle}>
          {!user ? (
            <>
              <button onClick={openLoginModal} style={buttonStyle}>Login</button>
              <button onClick={openRegisterModal} style={buttonStyle}>Register</button>
            </>
          ) : (
            <>
              <button onClick={logout} style={buttonStyle}>Logout</button>
              {/* If user is an admin, show a link to the Dashboard */}
              {user.is_admin && (
                <Link to="/dashboard" style={linkStyle}>
                  Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// Style for the header content (align title and buttons properly)
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const headerContentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '1200px', // Adjust this width as needed
  margin: '0 auto',
  alignItems: 'center',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '15px',
};

const buttonStyle = {
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer',
  border: 'none',
  background: '#007bff',
  color: 'white',
  borderRadius: '5px',
};

// Styling for the Dashboard link
const linkStyle = {
  padding: '10px 15px',
  fontSize: '16px',
  textDecoration: 'none',
  color: 'white',
  backgroundColor: '#007bff',
  borderRadius: '5px',
};

export default Header;
