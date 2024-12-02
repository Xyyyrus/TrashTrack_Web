import React from 'react';
import './HeroContact.css';

import Contact from '../assets/contact.webp'; // Update the path to your image

const HeroContact = () => {
  return (
    <div className="hero-containercss">
      <div className="text-container">
        <h1><span className="highlight">TrashTrack</span></h1>
        <img src={Contact} alt="Contact Icon" className="feature-icon" /> 
        <h1>Contact Us</h1>
        <div className="contact-details">
          <div className="contact-left">
            <p>Developer Email: cemd.adme2k@gmail.com </p>
            <p>Email: Jtm_japs@yahoo.com</p>
            <p>Phone #: 09560654888</p>
            <p>Telephone #: 0285337976</p>
          </div>
          <div className="contact-right">
            <p>Address: H2FW+752, Boni Ave. Cor., Lion's Rd, Mandaluyong, 1550 Metro Manila</p>
            <p>Facebook Page: Jasper Takeda Manabat</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HeroContact;
