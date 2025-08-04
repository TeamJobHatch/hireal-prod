
import { Link, useLocation } from 'react-router-dom';
import ProfileButton from './ProfileButton'; 

const Navigation = () => {
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/jobs') return 'jobs';
    if (path === '/download') return 'download';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="w-[80%] mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/images/LOGO.jpg"
              alt="JobHatch Logo"
              style={{ height: '40px', width: 'auto' }}
            />
            <span
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: 'Baloo 2, cursive' }}
            >
              JOBHATCH
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'home'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Jobs
            </Link>
            <Link
              to="/download"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'download'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Download
            </Link>
            <Link
              to="/webapp"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors inline-flex items-center space-x-1"
            >
              <span>Web App</span>
              <i className="fas fa-external-link-alt text-xs"></i>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <ProfileButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;

