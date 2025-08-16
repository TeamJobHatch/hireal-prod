import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  
  console.log('HomePage rendering...', { user });
  
  return (

    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fff7e8', 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '0 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Test Header */}
        <div style={{ 
          paddingTop: '64px', 
          paddingBottom: '48px', 
          textAlign: 'center',
          color: '#D97706',
          fontSize: '48px',
          fontWeight: 'bold'
        }}>
        </div>
        
        {/* Hero Section */}
        <div style={{ paddingTop: '64px', paddingBottom: '48px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '32px', 
              gap: '16px' 
            }}>
              <div style={{ 
                height: '64px', 
                width: '64px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#D97706' 
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>JH</span>
              </div>
              <h1 style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                margin: '0',
                color: '#D97706' 
              }}>JobHatch</h1>

              
            </div>
            <p style={{ 
              fontSize: '18px', 
              marginBottom: '24px', 
              fontWeight: '500',
              color: '#6b7280' 
            }}>Enterprise AI</p>
            <h2 style={{ 
              fontSize: '64px', 
              fontWeight: 'bold', 
              marginBottom: '32px', 
              lineHeight: '1.2',
              color: '#374151' 
            }}>
              Find Your <span style={{ color: '#D97706' }}>Perfect Candidate</span> in Minutes
            </h2>
            <p style={{ 
              fontSize: '18px', 
              lineHeight: '1.6', 
              marginBottom: '0',
              color: '#6b7280' 
            }}>
              🚀 AI-powered resume screening that analyzes candidates across{' '}
              <span style={{ fontWeight: '600', color: '#374151' }}>LinkedIn</span>, GitHub, and{' '}
              <span style={{ fontWeight: '600', color: '#374151' }}>personal portfolios</span>{' '}
              to find the perfect match for your role.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '32px', 
          margin: '64px 0' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '32px', 
            textAlign: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              backgroundColor: '#D97706' 
            }}>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '32px', height: '32px', color: 'white' }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>Smart Matching</h3>
            <p style={{ lineHeight: '1.5', color: '#6b7280' }}>AI analyzes technical skills, experience, and cultural fit</p>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '32px', 
            textAlign: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              backgroundColor: '#D97706' 
            }}>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '32px', height: '32px', color: 'white' }}>
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>Real-time Analysis</h3>
            <p style={{ lineHeight: '1.5', color: '#6b7280' }}>Watch as our AI researches each candidate across the web</p>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '32px', 
            textAlign: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              backgroundColor: '#D97706' 
            }}>
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '32px', height: '32px', color: 'white' }}>
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>Comprehensive Reports</h3>
            <p style={{ lineHeight: '1.5', color: '#6b7280' }}>Get detailed insights and rankings for informed decisions</p>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ textAlign: 'center', margin: '64px 0' }}>
          <button
            onClick={() => user ? navigate('/resumes/new') : navigate('/login')}
            style={{ 
              backgroundColor: '#D97706',
              color: 'white', 
              padding: '16px 32px', 
              fontSize: '18px', 
              fontWeight: '600', 
              borderRadius: '9999px', 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              border: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#B45309'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#D97706'}
          >
            🚀 Get Started Now <span style={{ marginLeft: '8px' }}>→</span>
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}></p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
