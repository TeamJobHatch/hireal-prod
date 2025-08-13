import PropTypes from 'prop-types';

const PageWrapper = ({ children, maxWidth = 'max-w-6xl' }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
      <div className={`${maxWidth} mx-auto p-6`}>
        {children}
      </div>
    </div>
  );
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string
};

export default PageWrapper;
