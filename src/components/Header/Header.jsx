import { useState, useEffect } from 'react';
import './Header.css';
import bannerDesktop from '../../assets/Banner_desktop_v2.3.jpg';
import bannerMobile from '../../assets/Hero-image_mobile_v2.0.png';

function Header() {
      const [isMobile, setIsMobile] = useState(window.innerWidth <= 1100)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1100)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
    return (
        <header className="header">
            <div className="header__banner">
                <img 
                src={window.innerWidth <= 1100 ? bannerMobile : bannerDesktop} 
                alt="Golf Sweepstake Banner"
                className="header__banner-image"
                />
            </div>
            <div className="header__welcome">
                <h1>Welcome to the Major Sweepstake.<br></br>
                    Please choose from the options below...
                </h1>
            </div>
        </header>
    );
}

export default Header;