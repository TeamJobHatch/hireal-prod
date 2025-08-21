import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { thunkFetchResumes } from "../../redux/resumes";
import './BatchSelectResumesToMatch.css';

const BatchSelectResumesToMatch = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resumesObj = useSelector(state => state.resumes);
  const resumes = Object.values(resumesObj || {});

  const [selectedResumeIds, setSelectedResumeIds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(thunkFetchResumes())
      .catch(() => setError("Failed to load resumes"));
  }, [dispatch]);

  const toggleSelect = (id) => {
    setSelectedResumeIds(prev =>
      prev.includes(id)
        ? prev.filter(rid => rid !== id)
        : [...prev, id]
    );
  };

  const handleBatchMatch = () => {
    if (selectedResumeIds.length === 0) {
      alert("Please select at least one resume.");
      return;
    }

    navigate(`/jobs/${jobId}/resumes/match_batch_results`, {
      state: { resumeIds: selectedResumeIds }
    });
  };

  if (error) return (
    <div className="batch-select-page">
      <div className="batch-select-container">
        <div className="batch-select-error">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="batch-select-page">
      <div className="batch-select-container">
        <div className="batch-select-header">
          <h2 className="batch-select-title">Batch Select Resumes to Match</h2>
          <p className="batch-select-subtitle">Choose multiple resumes to analyze against this job</p>
        </div>
        <div className="batch-select-card">
          <div className="batch-select-info">
            <p className="batch-select-info-text">
              Click on resumes to select them for batch matching
            </p>
          </div>
          <ul className="batch-select-list">
            {resumes.length === 0 && (
              <li className="batch-select-empty">No resumes found.</li>
            )}
            {resumes.map(resume => (
              <li
                key={resume.id}
                onClick={() => toggleSelect(resume.id)}
                className={`batch-select-item ${
                  selectedResumeIds.includes(resume.id) ? 'selected' : ''
                }`}
              >
                <div className="batch-select-item-header">
                  <div className="batch-select-checkbox">
                    {selectedResumeIds.includes(resume.id) && (
                      <svg className="batch-select-checkbox-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <div className="batch-select-item-icon">R</div>
                  <h3 className="batch-select-item-title">
                    {resume.file_name}
                  </h3>
                </div>
                <div className="batch-select-item-details">
                  {resume.file_url}
                </div>
              </li>
            ))}
          </ul>

          <div className="batch-select-actions">
            <button
              className="batch-select-confirm-btn"
              onClick={handleBatchMatch}
              disabled={selectedResumeIds.length === 0}
            >
              Confirm Batch Match
              {selectedResumeIds.length > 0 && (
                <span className="batch-select-count">{selectedResumeIds.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchSelectResumesToMatch;

