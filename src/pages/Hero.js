import { Link } from 'react-router-dom';
import './Hero.css';


const Hero = () => {
  return (
    <div className="hero-container">
      <div className="text-container">
        <h1>
          Manage Waste with Ease Using <span className="highlight">TrashTrack</span>
        </h1>
        <h2 className="highlight">
          'Together, we can make a difference in our environment!'
        </h2>
        <p>Waste Management, Fleet Monitoring, and Community Engagement</p>
        <div className="button-container">
          <Link to="/startnow">
            <button className="get-started-btn">Get Started Now</button>
          </Link>
          <a href="#2">
            <button className="contact-demo-btn">Contact Us</button>
          </a>
        </div>
      </div>
      <div className="image-container">
        <picture>
      {/* <img alt="" rel="preload" src="https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Flanding%20iphones.webp?alt=media&token=98ffd6f5-9fe3-46fd-b897-21d07b5734a8"/> */}
        </picture>
      </div>
    </div>
  );
};

export default Hero;
