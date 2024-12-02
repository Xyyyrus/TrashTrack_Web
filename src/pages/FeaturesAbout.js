import './FeaturesAbout.css'; // Importing CSS file
import VisionWebP from "../assets/vision.webp"; // Optimized WebP image
import MissionWebP from "../assets/mission.webp"; // Optimized WebP image

const FeaturesAbout = () => {
  return (
    <div className="features-container"> {/* Container for all feature cards */} 
      
      {/* Feature Card 1 */}
      <div className="feature-card">
        <picture>
          <source srcSet={MissionWebP} type="image/webp" />
          <img src="../assets/mission.png" alt="Mission Icon" className="feature-icon" loading="lazy" width="50" height="50" /> {/* Mission Icon */}
        </picture>
        <div className="feature-content">
          <h3 className="feature-title">Mission</h3> {/* Title */}
          <p className="feature-description">
            Our mission is to empower communities by providing innovative tools for efficient waste management through TrashTrack. We aim to enhance environmental sustainability by educating residents, facilitating collaboration between local authorities and the community, and streamlining waste collection processes. Through accessible mobile and web platforms, TrashTrack promotes responsible waste disposal, reduces environmental hazards, and fosters a cleaner, healthier living environment for all.
          </p> {/* Description */}
        </div>
      </div>

      {/* Feature Card 2 */}
      <div className="feature-card">
        <picture>
          <source srcSet={VisionWebP} type="image/webp" />
          <img src="../assets/vision.png" alt="Vision Icon" className="feature-icon" loading="lazy" width="50" height="50" /> {/* Vision Icon */}
        </picture>
        <div className="feature-content">
          <h3 className="feature-title">Vision</h3> {/* Title */}
          <p className="feature-description">
            TrashTrack aims to transform waste management in the community of Mandaluyong by providing a modern, efficient system that connects residents and local authorities. Through a user-friendly mobile and web application, the project helps households manage their waste, stay informed on waste-related issues, and collaborate with the local government.
          </p> {/* Description */}
        </div>
      </div>
      
    </div>
  );
};

export default FeaturesAbout;
