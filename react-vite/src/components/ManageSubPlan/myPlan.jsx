import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { thunkFetchMySubscription } from "../../redux/userSub";

export default function MyPlans() {
  const dispatch = useDispatch();
  const subscription = useSelector((state) => state.userSubscription);

  useEffect(() => {
    dispatch(thunkFetchMySubscription());
  }, [dispatch]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">⭐ My Subscription Plan</h1>
          <p className="text-lg text-gray-600">
            Manage your current subscription and billing
          </p>
        </div>

        {/* Main Content */}
        {!subscription ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Active Subscription</h2>
            <p className="text-gray-600 mb-6">
              You don&apos;t have an active subscription plan. Browse our plans to get started with premium features.
            </p>
            <Link 
              to="/plans"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Plans
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Plan Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{subscription.plan?.name || 'Current Plan'}</h2>
                  <p className="text-purple-100">{subscription.plan?.tagline}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    ${subscription.plan?.price || '0'}
                  </div>
                  <div className="text-sm text-purple-100">
                    per {subscription.plan?.billing_cycle || 'month'}
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Subscription Details</h3>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">
                      {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : "—"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">
                      {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : "—"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Trial Ends:</span>
                    <span className="font-medium">
                      {subscription.trial_end_date ? new Date(subscription.trial_end_date).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Status</h3>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${subscription.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {subscription.is_active ? "✅ Active" : "❌ Inactive"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Auto Renew:</span>
                    <span className={`font-medium ${subscription.auto_renew ? 'text-green-600' : 'text-gray-600'}`}>
                      {subscription.auto_renew ? "🔄 Enabled" : "⏹ Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  to="/plans"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Change Plan
                </Link>
                <Link 
                  to="/userhome"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
