import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkFetchOneJob } from '../../redux/jobPositions';
import "./JobPositionDetail.css";

const JobPositionDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      const res = await dispatch(thunkFetchOneJob(id));
      if (res?.error) {
        setError("Job not found or you are not authorized.");
      } else {
        setJob(res);
      }
    };
    loadJob();
  }, [dispatch, id]);

  if (error) {
    return (
      <div className="job-detail-page">
        <div className="job-detail-container">
          <div className="job-error-state">
            <p className="job-error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-detail-page">
        <div className="job-detail-container">
          <div className="job-loading-state">
            <p className="job-loading-message">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <div className="job-detail-card">
          <div className="job-content">
            <h1 className="job-title">{job.title}</h1>
            <p className="job-meta">
              Created at: {new Date(job.created_at).toLocaleString()}
            </p>
            <p className="job-description">{job.description}</p>
          </div>
          
          <div className="job-basic-actions">
            <button
              className="job-edit-button"
              onClick={() => navigate(`/joblist/edit/${job.id}`)}
            >
              Edit
            </button>
            <button
              className="job-back-button"
              onClick={() => navigate("/joblist")}
            >
              Back to Jobs
            </button>
          </div>

          <div className="job-match-actions">
            <button
              className="job-match-single-button"
              onClick={() => {
                // Navigate to single resume selection page for this job.
                // After selecting a resume, user will be redirected to the match result page.
                navigate(`/jobs/${job.id}/resumes/select`);
              }}
            >
              Select Resume to Match
            </button>

            <button
              className="job-match-batch-button"
              onClick={() => {
                // Navigate to batch resume selection page for this job,
                // allowing multiple resumes to be selected for batch matching.
                navigate(`/jobs/${job.id}/select_resumes_batch`);
              }}
            >
              Batch Match Multiple Resumes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPositionDetail;

