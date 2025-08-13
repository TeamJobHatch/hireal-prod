import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="text-6xl mb-6">🎉</div>
          
          {/* Success Message */}
          <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your subscription has been activated successfully.
          </p>
          
          {/* Celebration */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              🚀 Welcome to JobHatch Premium! You now have access to all premium features.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              to="/userhome"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link 
              to="/my-plans"
              className="block w-full bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View My Subscription
            </Link>
            <Link 
              to="/resumes/new"
              className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Using Premium Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
