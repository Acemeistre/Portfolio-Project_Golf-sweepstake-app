import './Header.css';
import banner from '../../assets/Banner_desktop_v2.1.jpg';

function Header() {
    return (
        <header className="header">
            <div className="header__banner">
                <img 
                src={banner} alt="Golf Sweepstake Banner"
                className="header__banner-image"
                />
            </div>
            <div className="header__welcome">
                <h1>Welcome to the Major Sweepstake.
                    Please choose from the options below...
                </h1>
            </div>
        </header>
    );
}

export default Header;