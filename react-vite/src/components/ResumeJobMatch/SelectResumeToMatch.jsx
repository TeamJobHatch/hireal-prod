import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkFetchResumes } from "../../redux/resumes";
import './SelectResumeToMatch.css';

const SelectResumeToMatch = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get all resumes from redux store and convert to array
  const resumesObj = useSelector(state => state.resumes);
  const resumes = Object.values(resumesObj || {});

  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [error, setError] = useState("");

  // Fetch resumes on mount
  useEffect(() => {
    dispatch(thunkFetchResumes())
      .catch(() => setError("Failed to load resumes"));
  }, [dispatch]);

  // Confirm selection and navigate to match page
  const handleConfirm = () => {
    if (!selectedResumeId) {
      alert("Please select a resume first.");
      return;
    }
    navigate(`/jobs/${jobId}/resumes/${selectedResumeId}/match`);
  };

  if (error) return (
    <div className="select-resume-page">
      <div className="select-resume-container">
        <div className="select-resume-error">Error: {error}</div>
      </div>
    </div>
  );

  return (
    <div className="select-resume-page">
      <div className="select-resume-container">
        <div className="select-resume-header">
          <h2 className="select-resume-title">Select a Resume to Match</h2>
          <p className="select-resume-subtitle">Choose a resume to analyze against this job</p>
        </div>
        <div className="select-resume-card">
          <ul className="select-resume-list">
            {resumes.length === 0 && (
              <li className="select-resume-empty">No resumes found.</li>
            )}
            {resumes.map((resume) => (
              <li
                key={resume.id}
                className={`select-resume-item ${
                  selectedResumeId === resume.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedResumeId(resume.id)}
              >
                <div className="select-resume-item-header">
                  <div className="select-resume-item-icon">R</div>
                  <h3 className="select-resume-item-title">
                    {resume.file_name || "Unnamed Resume"}
                  </h3>
                </div>
                <div className="select-resume-item-details">
                  {/* <div className="select-resume-item-detail">
                    <span className="select-resume-item-label">ID:</span>
                    <span className="select-resume-item-value">{resume.id}</span>
                  </div> */}
                  <div className="select-resume-item-detail">
                    <span className="select-resume-item-label">URL:</span>
                    <a
                      href={resume.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="select-resume-item-link"
                      onClick={e => e.stopPropagation()} // prevent li click on link click
                    >
                      {resume.file_url}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="select-resume-actions">
            <button
              className="select-resume-confirm-btn"
              onClick={handleConfirm}
              disabled={!selectedResumeId}
            >
              Confirm and Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectResumeToMatch;


