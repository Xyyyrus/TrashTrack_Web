import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container d-flex justify-content-between">
        <div className="left-container">
       
          <p>&copy; 2024 Trash Track, All rights reserved.</p>
        </div>
        <div>
          <Link to='/adminlogin' className="text-white mx-2">Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
