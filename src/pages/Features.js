import './Features.css';


const Features = () => {
  return (
    <div className="features-container">
      <div className="feature-card">
        <img src="https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Frecycle.webp?alt=media&token=e0f7d7a7-a451-453a-bd67-3d11d5d3f6ae" alt="Recycling Icon" className="feature-icon" loading="lazy" width="50" height="50" />
        <div className="feature-content">
          <h3 className="feature-title">Recycle and Sorting</h3>
          <p className="feature-description">Teaches the people a proper way to dispose and manage your waste properly.</p>
        </div>
      </div>

      <div className="feature-card">
        <img src="https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Fanalysis.webp?alt=media&token=3689bcdc-0a26-4bec-98d1-3606ac92ad03" alt="Analysis Icon" className="feature-icon" loading="lazy" width="50" height="50" />
        <div className="feature-content">
          <h3 className="feature-title">Trash Analysis</h3>
          <p className="feature-description">Provides you an overview of waste data collected by the City Environmental Management Office.</p>
        </div>
      </div>

      <div className="feature-card">
        <img src="https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Fcommunity.webp?alt=media&token=a49dfabb-c9b8-492c-9241-621c478f913b" alt="Community Icon" className="feature-icon" loading="lazy" width="50" height="50" />
        <div className="feature-content">
          <h3 className="feature-title">Community Forum</h3>
          <p className="feature-description">Platform where you can interact with each other.</p>
        </div>
      </div>

      <div className="feature-card">
        <img src="https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Froutes.webp?alt=media&token=1c19881f-48c4-4be7-9b72-4c050d01f242" alt="Routes Icon" className="feature-icon" loading="lazy" width="50" height="50" />
        <div className="feature-content">
          <h3 className="feature-title">Routes and Schedule</h3>
          <p className="feature-description">Provides a user-friendly interface that shows the location of waste collectors and their schedule of pickup.</p>
        </div>
      </div>

      
    </div>
  );
};

export default Features;
