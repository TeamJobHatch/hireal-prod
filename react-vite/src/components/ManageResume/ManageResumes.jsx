import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import {
  thunkFetchResumes,
  thunkDeleteResume
} from "../../redux/resumes";
import "./ManageResumes.css";

const ManageResumes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const resumes = useSelector(state => Object.values(state.resumes));

  useEffect(() => {
    dispatch(thunkFetchResumes());
  }, [dispatch]);

  const handleDelete = async (resumeId) => {
    const confirmed = window.confirm("Are you sure you want to delete this resume?");
    if (confirmed) {
      await dispatch(thunkDeleteResume(resumeId));
    }
  };

  const handleAiScore = (resumeId) => {
    navigate(`/resumes/${resumeId}/ai-score`);
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">My Resumes</h2>
        <div className="section-actions">
          <Link to="/resumes/new" className="action-button primary">
            + Add New Resume
          </Link>
        </div>
      </div>
      <div className="section-content">
        {resumes.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No resumes uploaded yet.</p>
          </div>
        ) : (
          <div className="items-list">
            {resumes.map(resume => (
              <div key={resume.id} className="item-card">
                <div className="item-content">
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="item-title"
                  >
                    {resume.file_name}
                  </a>
                  <p className="item-date">
                    {new Date(resume.uploaded_at).toLocaleString()}
                  </p>
                </div>
                <div className="item-actions">
                  <Link to={`/resumes/${resume.id}/edit`} className="job-edit-action-button">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleAiScore(resume.id)}
                    className="job-edit-action-button"
                  >
                    AI Score
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="job-delete-action-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageResumes;

