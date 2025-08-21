
import { Link} from 'react-router-dom';
import ProfileButton from './ProfileButton'; 
import './Navigation.css';

const Navigation = () => {
  return (
    <header className="navigation-header">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo-section">
          <img
            src="/images/LOGO.jpg"
            alt="JobHatch Logo"
            className="nav-logo"
          />
          <span className="brand-name">JobHatch</span>
        </Link>

        {/* Auth Buttons */}
        <div className="nav-right">
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Navigation;

