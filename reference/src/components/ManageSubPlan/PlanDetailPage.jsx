import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { thunkFetchPlans } from '../../redux/subPlans';
import { thunkCreateCheckoutSession, clearCheckoutUrl } from '../../redux/payment';
import './PlanDetailPage.css';

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

  if (!plan) return (
    <div className="plan-detail-page">
      <div className="plan-detail-container">
        <div className="plan-detail-loading">Loading plan details...</div>
      </div>
    </div>
  );

  return (
    <div className="plan-detail-page">
      <div className="plan-detail-container">
        <div className="plan-detail-card">
          <div className="plan-detail-header">
            <h1 className="plan-detail-title">{plan.name}</h1>
            <p className="plan-detail-tagline">{plan.tagline || 'N/A'}</p>
            <div className="plan-detail-price">${plan.price}</div>
            <div className="plan-detail-billing">per {plan.billing_cycle}</div>
          </div>

          {plan.description && (
            <div className="plan-detail-description">
              <h3 className="plan-detail-description-title">Description</h3>
              <p className="plan-detail-description-text">{plan.description}</p>
            </div>
          )}

          <div className="plan-detail-features">
            <h3 className="plan-detail-features-title">Feature Flags</h3>
            <pre className="plan-detail-features-content">
              {plan.feature_flags || 'No features specified'}
            </pre>
          </div>

          {error && (
            <div className="plan-detail-error">{error}</div>
          )}

          <div className="plan-detail-actions">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="plan-detail-subscribe-btn"
            >
              {loading ? 'Redirecting...' : 'Subscribe / Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailPage;

