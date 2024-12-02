// import React from 'react';
// import './HeroGuidePage.css';
// import phoneImage from '../assets/landing iphones.webp'; // Update the path to your image
// import {  Link } from '@mui/material';
// const HeroGuidepage = () => {
//   return (
//     <div className="hero-container">
//       <div className="text-container">
//         <h1><span className="highlight">TrashTrack</span></h1>
//         <h1>How to Download and Install</h1>
//         <Link
//           href="https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/user_app%2Fapp-release.apk?alt=media&token=5372d59f-2158-49c0-ad26-6343b3e99e8a"
//           download="trashtrack.apk"
//           underline="hover"
//           color="primary"
//         >
//         <button className="get-started-btn">Download The App</button>
//         </Link>
//       </div>
//       <div className="image-container">
//         <img src={phoneImage} alt="TrashTrack App" />
//       </div>
//       <hr />
//     </div>
//   );
// };

// export default HeroGuidepage; kay luis


import React from 'react';
import './HeroGuidePage.css';
import phoneImage from '../assets/landing iphones.webp'; // Update the path to your image
import { Link } from '@mui/material';

const HeroGuidepage = () => {
  return (
    <div className="hero-container">
      <div className="text-container">
        <h1><span className="highlight">TrashTrack</span></h1>
        <h1>How to Download and Install</h1>
        <Link
          href="https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/user_app%2FTrashTrack.apk?alt=media&token=931da99a-ccdb-478d-a8f9-52732ae86123"
          download="trashtrack.apk"
          underline="hover"
          color="primary"
          target="_blank" // Opens the link in a new tab
          rel="noopener noreferrer" // Prevents tabnabbing
        >
          <button className="get-started-btn">Download The App</button>
        </Link>
      </div>
      <div className="image-container">
        <img src={phoneImage} alt="TrashTrack App" />
      </div>
      <hr />
    </div>
  );
};

export default HeroGuidepage;

