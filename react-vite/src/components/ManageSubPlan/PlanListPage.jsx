import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  thunkFetchPlans,
  thunkCreatePlan,
  thunkUpdatePlan,
  thunkDeletePlan,
} from '../../redux/subPlans';
import { useNavigate } from 'react-router-dom';
import './PlanListPage.css';

const PlanListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current logged-in user from Redux session slice
  const currentUser = useSelector((state) => state.session.user);
  const isAdmin = currentUser?.is_admin === true;

  // Get all plans from Redux store as an array
  const plans = useSelector((state) => Object.values(state.plans));

  // Local state for showing forms and form data
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(null); // stores plan id or null
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    price: '',
    billing_cycle: 'month',
    feature_flags: '',
  });

  // Fetch all plans on component mount
  useEffect(() => {
    dispatch(thunkFetchPlans());
  }, [dispatch]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  // Create new plan (admin only)
  const handleCreate = async () => {
    try {
      await dispatch(
        thunkCreatePlan({
          ...formData,
          price: parseFloat(formData.price),
        })
      );
      setShowCreateForm(false);
      resetForm();
    } catch (err) {
      alert('Create failed: ' + (err.error || 'Unknown error'));
    }
  };

  // Update existing plan (admin only)
  const handleUpdate = async () => {
    try {
      await dispatch(
        thunkUpdatePlan(showEditForm, {
          ...formData,
          price: parseFloat(formData.price),
        })
      );
      setShowEditForm(null);
      resetForm();
    } catch (err) {
      alert('Update failed: ' + (err.error || 'Unknown error'));
    }
  };

  // Delete plan with confirmation (admin only)
  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await dispatch(thunkDeletePlan(planId));
      } catch (err) {
        alert('Delete failed: ' + (err.error || 'Unknown error'));
      }
    }
  };

  // Prepare edit form with selected plan's data
  const startEdit = (plan) => {
    setShowEditForm(plan.id);
    setFormData({
      name: plan.name,
      tagline: plan.tagline || '',
      description: plan.description || '',
      price: plan.price.toString(),
      billing_cycle: plan.billing_cycle,
      feature_flags: plan.feature_flags || '',
    });
  };

  // Navigate to plan details page (non-admin users)
  const handleViewDetails = (planId) => {
    navigate(`/plans/${planId}`);
  };

  // Reset form to initial empty state
  const resetForm = () => {
    setFormData({
      name: '',
      tagline: '',
      description: '',
      price: '',
      billing_cycle: 'month',
      feature_flags: '',
    });
  };

  return (
    <div className="plan-list-page">
      <div className="plan-list-container">
        <h1 className="plan-list-title">Subscription Plans</h1>

        {/* Admin: Show create button */}
        {isAdmin && (
          <button
            className="plan-list-create-btn"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Plan
          </button>
        )}

        {/* Admin: Create Plan Form */}
        {showCreateForm && (
          <div className="plan-form-section">
            <h2 className="plan-form-title">Create New Plan</h2>
            <PlanForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleCreate}
              onCancel={() => {
                setShowCreateForm(false);
                resetForm();
              }}
            />
          </div>
        )}

        {/* Admin: Edit Plan Form */}
        {showEditForm && (
          <div className="plan-form-section">
            <h2 className="plan-form-title">Edit Plan</h2>
            <PlanForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleUpdate}
              onCancel={() => {
                setShowEditForm(null);
                resetForm();
              }}
            />
          </div>
        )}

        {/* Plans List */}
        <div className="plan-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3 className="plan-card-title">{plan.name}</h3>
              <p className="plan-card-tagline">{plan.tagline}</p>
              <p className="plan-card-price">
                ${plan.price} / {plan.billing_cycle}
              </p>

              {/* Admin controls: Edit & Delete */}
              {isAdmin ? (
                <div className="plan-card-actions">
                  <button
                    onClick={() => startEdit(plan)}
                    className="plan-card-edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="plan-card-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                // Non-admin: View details and subscribe
                <button
                  onClick={() => handleViewDetails(plan.id)}
                  className="plan-card-view-btn"
                >
                  View Details & Subscribe
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable Plan Form component
const PlanForm = ({ formData, onChange, onSubmit, onCancel }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="plan-form"
  >
    <div className="plan-form-group">
      <label className="plan-form-label">Name *</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={onChange}
        required
        className="plan-form-input"
      />
    </div>

    <div className="plan-form-group">
      <label className="plan-form-label">Tagline</label>
      <input
        type="text"
        name="tagline"
        value={formData.tagline}
        onChange={onChange}
        className="plan-form-input"
      />
    </div>

    <div className="plan-form-group">
      <label className="plan-form-label">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        className="plan-form-textarea"
        rows={3}
      />
    </div>

    <div className="plan-form-group">
      <label className="plan-form-label">Price (USD) *</label>
      <input
        type="number"
        step="0.01"
        min="0"
        name="price"
        value={formData.price}
        onChange={onChange}
        required
        className="plan-form-input"
      />
    </div>

    <div className="plan-form-group">
      <label className="plan-form-label">Billing Cycle *</label>
      <select
        name="billing_cycle"
        value={formData.billing_cycle}
        onChange={onChange}
        required
        className="plan-form-select"
      >
        <option value="month">Monthly</option>
        <option value="year">Yearly</option>
      </select>
    </div>

    <div className="plan-form-group">
      <label className="plan-form-label">Feature Flags (JSON string)</label>
      <textarea
        name="feature_flags"
        value={formData.feature_flags}
        onChange={onChange}
        className="plan-form-textarea"
        rows={2}
      />
    </div>

    <div className="plan-form-actions">
      <button
        type="submit"
        className="plan-form-submit-btn"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="plan-form-cancel-btn"
      >
        Cancel
      </button>
    </div>
  </form>
);

export default PlanListPage;
