import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center p-3 mt-4">
      <p>Page Views: <span id="pageHits" className="badge bg-primary" tabIndex="0">0</span></p>
      &copy; 2025 by The Pacific Window. Powered by AGfoods.com
    </footer>
  );
};

export default Footer;
