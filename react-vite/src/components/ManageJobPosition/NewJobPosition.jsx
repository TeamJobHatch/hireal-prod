import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkCreateJob } from '../../redux/jobPositions';
import "./NewJobPosition.css";

const NewJobPosition = ({ fromOnboarding = false, onComplete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(thunkCreateJob({ title, description }));

    if (res && res.error) {
      setErrors(res);
    } else if (fromOnboarding && onComplete) {
      onComplete(res.id);
    } else {
      navigate('/joblist');
    }
  };

  return (
    <div className="new-job-page">
      <div className="new-job-container">
        <div className="new-job-content">
          <div className="new-job-card">
            <div className="new-job-header">
              <h2 className="new-job-title">Create New Job Position</h2>
            </div>
            <form onSubmit={handleSubmit} className="new-job-form">
              <div className="new-job-form-group">
                <label className="new-job-form-label">Title</label>
                <input
                  type="text"
                  className="new-job-form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter job title"
                  required
                />
                {errors.title && <p className="new-job-error">{errors.title}</p>}
              </div>

              <div className="new-job-form-group">
                <label className="new-job-form-label">Description</label>
                <textarea
                  className="new-job-form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter job description"
                />
              </div>

              <div className="new-job-form-actions">
                <button
                  type="submit"
                  className="create-job-button"
                >
                  Create Job Position
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewJobPosition;
