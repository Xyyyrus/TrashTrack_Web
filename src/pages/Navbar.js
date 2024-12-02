import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; // Example icon

const Navbar = ({ nonce }) => { // Accept nonce as a prop
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Pass nonce in the img tag as part of CSP */}
        <img 
          alt='logo' 
          src="https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Ftrashtrack-logo.png?alt=media&token=a4b3fb03-d665-4bb5-b0d6-94d88ebd6e71" 
          nonce={nonce} // Add nonce attribute
        />
        <Link to="/" className="brand-name">TrashTrack</Link>
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} /> {/* FontAwesome hamburger icon */}
      </button>

      <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/startnow">App Guide</Link>  
        <a href="#1">About</a>
        <a href="#2">Contact us</a> 
      </div> 
      <a
        href=""
        download="trashtrack.apk"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="app-button">Get the App</button>
      </a>
    </nav>
  );
};

export default Navbar;
