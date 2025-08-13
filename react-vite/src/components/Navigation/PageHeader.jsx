import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PageHeader = ({ 
  title, 
  subtitle, 
  icon, 
  backTo = '/userhome', 
  backText = '← Back to Dashboard',
  actions = []
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(backTo)}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {backText}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          {icon && <div className="text-4xl mb-2">{icon}</div>}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
        </div>

        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {actions.map((action, index) => (
              <Link
                key={index}
                to={action.to}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${action.variant === 'secondary' 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  backTo: PropTypes.string,
  backText: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary'])
  }))
};

export default PageHeader;
