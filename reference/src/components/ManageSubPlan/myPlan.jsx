import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchMySubscription } from "../../redux/userSub";
import './myPlan.css';

export default function MyPlans() {
  const dispatch = useDispatch();
  const subscription = useSelector((state) => state.userSubscription);

  useEffect(() => {
    dispatch(thunkFetchMySubscription());
  }, [dispatch]);

  if (!subscription) {
    return (
      <div className="my-plan-container">
        <div className="my-plan-empty">
          <div className="my-plan-empty-title">No Active Subscription</div>
          <div className="my-plan-empty-text">You have no active subscription.</div>
        </div>
      </div>
    );
  }

  const plan = subscription.plan || {};

  return (
    <div className="my-plan-container">
      <div className="my-plan-card">
        <div className="my-plan-header">
          <h2 className="my-plan-title">My Plan</h2>
          <div className={`my-plan-status ${subscription.is_active ? 'active' : 'inactive'}`}>
            {subscription.is_active ? 'Active' : 'Inactive'}
          </div>
        </div>
        <div className="my-plan-details">
          <div className="my-plan-detail-row">
            <div className="my-plan-detail-label">Plan Name:</div>
            <div className="my-plan-detail-value my-plan-name">{plan.name}</div>
          </div>
          <div className="my-plan-detail-row">
            <div className="my-plan-detail-label">Description:</div>
            <div className="my-plan-detail-value my-plan-tagline">{plan.tagline}</div>
          </div>
          <div className="my-plan-detail-row">
            <div className="my-plan-detail-label">Price:</div>
            <div className="my-plan-detail-value my-plan-price">${plan.price} / {plan.billing_cycle}</div>
          </div>
          <div className="my-plan-detail-row">
            <div className="my-plan-detail-label">Start Date:</div>
            <div className="my-plan-detail-value">{new Date(subscription.start_date).toLocaleDateString()}</div>
          </div>
          <div className="my-plan-detail-row">
            <div className="my-plan-detail-label">End Date:</div>
            <div className="my-plan-detail-value">{subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : "—"}</div>
          </div>
          <div className="my-plan-detail-row">
            <div className="my-plan-detail-label">Trial Ends:</div>
            <div className="my-plan-detail-value">{subscription.trial_end_date ? new Date(subscription.trial_end_date).toLocaleDateString() : "—"}</div>
          </div>
          <div className="my-plan-detail-row">
            <div className="my-plan-detail-label">Auto Renew:</div>
            <div className="my-plan-detail-value">{subscription.auto_renew ? "🔄 Yes" : "⏹ No"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
