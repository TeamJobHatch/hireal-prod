

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserHome = () => {
  const user = useSelector((state) => state.session.user);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.username || user?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Your AI-powered recruitment dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="text-lg font-semibold text-gray-800">Resumes</h3>
            <p className="text-gray-600">Manage & Analyze</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">💼</div>
            <h3 className="text-lg font-semibold text-gray-800">Jobs</h3>
            <p className="text-gray-600">Track Positions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800">Matches</h3>
            <p className="text-gray-600">AI Analysis</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="text-lg font-semibold text-gray-800">Plan</h3>
            <p className="text-gray-600">Subscription</p>
          </div>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Management */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">📄</div>
              <h2 className="text-xl font-bold text-gray-800">Resume Management</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Upload, analyze, and optimize your resumes with AI-powered insights.
            </p>
            <div className="space-y-3">
              <Link 
                to="/resumes" 
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
              >
                View All Resumes
              </Link>
              <Link 
                to="/resumes/new" 
                className="block w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg transition-colors text-center"
              >
                Upload New Resume
              </Link>
            </div>
          </div>

          {/* Job Positions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">💼</div>
              <h2 className="text-xl font-bold text-gray-800">Job Positions</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Manage job openings and find the perfect candidates with AI matching.
            </p>
            <div className="space-y-3">
              <Link 
                to="/joblist" 
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
              >
                View All Jobs
              </Link>
              <Link 
                to="/joblist/new" 
                className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg transition-colors text-center"
              >
                Post New Job
              </Link>
            </div>
          </div>

          {/* AI Matching */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">🎯</div>
              <h2 className="text-xl font-bold text-gray-800">AI Matching</h2>
            </div>
            <p className="text-gray-600 mb-4">
              View detailed matching history and AI-powered candidate analysis.
            </p>
            <div className="space-y-3">
              <Link 
                to="/match-history" 
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
              >
                View Match History
              </Link>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">⭐</div>
              <h2 className="text-xl font-bold text-gray-800">Subscription</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Manage your subscription plan and access premium features.
            </p>
            <div className="space-y-3">
              <Link 
                to="/my-plans" 
                className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
              >
                My Current Plan
              </Link>
              <Link 
                to="/plans" 
                className="block w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-2 px-4 rounded-lg transition-colors text-center"
              >
                Browse Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-orange-800 mb-3">💡 Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-orange-700">
            <div>
              <strong>Upload Multiple Resumes:</strong> Compare different candidates easily
            </div>
            <div>
              <strong>Use AI Analysis:</strong> Get detailed insights on resume quality and fit
            </div>
            <div>
              <strong>Track Matches:</strong> View historical data to improve your hiring process
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
