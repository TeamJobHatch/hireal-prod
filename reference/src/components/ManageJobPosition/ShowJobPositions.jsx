import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import {
  thunkDeleteJob,
  thunkFetchAllJobs,
} from '../../redux/jobPositions';
import "./ShowJobPositions.css";

const ShowJobPositions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobs = useSelector((state) => Object.values(state.jobs));

  useEffect(() => {
    dispatch(thunkFetchAllJobs());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (confirmed) {
      await dispatch(thunkDeleteJob(id));
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Your Job Positions</h2>
        <div className="section-actions">
          <Link to="/joblist/new" className="action-button primary">
            + New Job
          </Link>
        </div>
      </div>
      <div className="section-content">
        <div className="items-list">
          {jobs.length === 0 && (
            <div className="empty-state">
              <p className="empty-state-description">No jobs found. Create one!</p>
            </div>
          )}
          {jobs.map((job) => (
            <div key={job.id} className="item-card">
              <div className="item-content">
                <Link
                  to={`/joblist/${job.id}`}
                  className="item-title"
                >
                  {job.title}
                </Link>
                <p className="item-description">{job.description}</p>
              </div>
              <div className="item-actions">
                <button
                  onClick={() => navigate(`/joblist/edit/${job.id}`)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowJobPositions;

