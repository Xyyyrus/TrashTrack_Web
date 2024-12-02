import React from 'react';
import './HeroAboutpage.css';
import phoneImageWebP from '../assets/about.webp'; // Use WebP format for better performance

const HeroAboutpage = () => {
  return (
    <div className="hero-container">
      <div className="text-container">
        <h1>About Us</h1>
        
        <h2 className="highlight">What is Trash?</h2> {/* Changed to h2 */}
        <p>  
          A waste is defined as an unwanted object that serves no purpose or unusable by-product of human activities, industrial or residential. It can be identified from a wide range of substances like food scraps, packaging materials, old appliances, and hazardous chemicals. It can also be classified into a variety of types such as municipal solid waste, industrial waste, agricultural waste, and hazardous waste, with each type requiring different disposal methods. If not handled well, it could cause health hazards.
        </p>
        
        <hr />
        
        <h2>What is TrashTrack</h2> {/* Changed to h2 */}
        <p>
          TrashTrack’s priority is to provide a system that assists in combating the mismanagement of waste. At its core, TrashTrack is not just a technological approach but a system designed to inform and educate residents on waste-related topics while aiding the LGU side in handling waste.
        </p>
      </div>
    
      <div className="image-container">
        <picture>
          <source srcSet={phoneImageWebP} type="image/webp" />
          <img src="../assets/about.png" alt="TrashTrack App" loading="lazy" />
        </picture>
      </div>
    </div>
  );
};

export default HeroAboutpage;
