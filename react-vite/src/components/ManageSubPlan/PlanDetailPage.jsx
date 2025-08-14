import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { thunkFetchPlans } from '../../redux/subPlans';
import { thunkCreateCheckoutSession, clearCheckoutUrl } from '../../redux/payment';

const PlanDetailPage = () => {
  const { planId } = useParams();
  const dispatch = useDispatch();

  const plans = useSelector((state) => state.plans);
  const plan = plans[planId];

  const checkoutUrl = useSelector((state) => state.payments.checkoutUrl);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load plans if not available
  useEffect(() => {
    if (!plan) {
      dispatch(thunkFetchPlans());
    }
  }, [dispatch, plan]);

  // When checkoutUrl changes (means backend返回了支付页面URL)，跳转过去
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      dispatch(clearCheckoutUrl()); // 清理状态，防止重复跳转
    }
  }, [checkoutUrl, dispatch]);

  // 触发 redux thunk 创建 checkout session
  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = await dispatch(thunkCreateCheckoutSession(planId));
      if (!url) throw new Error('Failed to get checkout url');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!plan) return <div className="p-6 text-center">Loading plan details...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{plan.name}</h1>
      <p className="text-gray-700 mb-2"><strong>Tagline:</strong> {plan.tagline || 'N/A'}</p>
      <p className="mb-4 whitespace-pre-wrap">{plan.description || 'No description provided.'}</p>

      <p className="text-lg font-semibold mb-4">
        Price: ${plan.price} / {plan.billing_cycle}
      </p>

      <div className="mb-4">
        <strong>Feature Flags:</strong>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
          {plan.feature_flags || 'No features specified'}
        </pre>
      </div>

      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`px-6 py-3 rounded text-white font-semibold ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Redirecting...' : 'Subscribe / Pay Now'}
      </button>
    </div>
  );
};

export default PlanDetailPage;

