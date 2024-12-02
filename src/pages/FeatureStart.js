import './FeaturesStart.css'; // Importing CSS file
import downloadapp from '../assets/download.png'; // Importing download app icon image
import downloadapp2 from '../assets/download2.png'; 
import install from '../assets/install.jpg'; // Importing install icon image




const FeaturesStart = () => {
  return (
    <div className="features-container"> {/* Container for all feature cards */}
      {/* Feature Card 1 */}
      <div className="feature-card">
      <img src={downloadapp} alt="download" className="feature-icon" />
      <img src={downloadapp2} alt="download" className="feature-icon" />  
        <div className="feature-content">
          <h3 className="feature-title">Step 1: Download the Application</h3> {/* Title */}
          <p className="feature-description">download the app using the buttons in the picture provided.</p> {/* Description */}
        </div>
      </div>

      <div className="feature-card">
      
        <div className="feature-content">
          <h3 className="feature-title">Step 2: Install the App</h3> {/* Title */}
          <p className="feature-description">After Downloading the app. You can open the File manager on your device and install the apk.</p> {/* Description */}
        </div>
      </div>

      {/* Feature Card 3 */}
      <div className="feature-card">
      <img src={install} alt="install" className="feature-icon" />  
        <div className="feature-content">
          <h3 className="feature-title">Step 3: Install From Unknown sources</h3> {/* Title */}
          <p className="feature-description">Turn on the install from Unknown source (you can turn it off after installion), Then click Install.</p> {/* Description */}
        </div>
      </div>

      {/* Feature Card 4 */}
      <div className="feature-card">
       
        <div className="feature-content">
          <h3 className="feature-title">Step 4: Open the App and Register </h3> {/* Title */}
          <p className="feature-description">Open the App, Register and Experience our services.</p> {/* Description */}
        </div>
      </div>
     
    </div>
    
    
  );
};

export default FeaturesStart;
