import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';
import HeroAboutpage from './HeroAboutpage';
import FeaturesAbout from './FeaturesAbout';
import HeroContact from "./HeroContact";

const Landpage = ({ nonce }) => {
  return (
    <>
      {/* Add CSP meta tag with the nonce */}
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={`script-src 'self' 'nonce-${nonce}'`}
        />
      </head>

      <div className="landpage">
        <div className="Navbar">
          <Navbar />
        </div>
        <div className="Hero">
          <Hero />
        </div>
        <div className="Features">
          <Features />
        </div>
        <div className="HeroAboutpage">
          <section id='1'>
            <HeroAboutpage />
          </section>
        </div>
        <div className="FeaturesAbout">
          <FeaturesAbout />
        </div>
        <div className="HeroContact">
          <section id='2'>
            <HeroContact />
          </section>
        </div>
        <div className="Footer">
          <Footer />
        </div>
      </div>

      {/* Example of inline script using the nonce */}
      <script nonce={nonce}>
        console.log('This inline script is allowed by CSP because of the nonce');
      </script>
    </>
  );
};

export default Landpage;
