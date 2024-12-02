import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/trashtrack-logo.png';

const Navbarcopy = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="TrashTrack Logo" className="navbar-logo" />
        <Link to="/" className="brand-name">TrashTrack</Link>
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        &#9776; {/* Hamburger icon */}
      </button>
      <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <Link to="/*">Home</Link>
        <Link to="/startnow">App Guide</Link>  
      </div> 
      <a
        href="https://drive.google.com/drive/folders/1bJLJgglf9hiHMCXp7ud8dNmVYilCKOwS?usp=sharing"
        download="trashtrack.apk"
      >
        <button className="app-button">Get the App</button>
      </a>
    </nav>
  );
};

export default Navbarcopy;
