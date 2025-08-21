import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkBatchMatchSelectedResumes, clearBatchMatchResults } from "../../redux/aiJobResumeScore";
import './BatchResumeJobMatch.css';

const BatchResumeJobMatch = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resumeIds = location.state?.resumeIds || [];
  const batchMatchResults = useSelector(state => state.aijobResumeScore.batchMatchResults || []);
  const resumesById = useSelector(state => state.resumes || {});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId || resumeIds.length === 0) {
      setError("Missing jobId or resumeIds");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    dispatch(thunkBatchMatchSelectedResumes(jobId, resumeIds))
      .catch(err => setError(err.message || "Failed to fetch batch match results"))
      .finally(() => setLoading(false));

    return () => {
      dispatch(clearBatchMatchResults());
    };
  }, [dispatch, jobId, resumeIds]);

  // Optional: redirect back if missing params (e.g., refresh page)
  useEffect(() => {
    if (resumeIds.length === 0) {
      const timeout = setTimeout(() => {
        navigate(`/jobs/${jobId}/select_resumes_batch`);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [resumeIds, navigate, jobId]);

  if (loading) return (
    <div className="batch-match-page">
      <div className="batch-match-container">
        <div className="batch-match-loading">
          <div className="batch-match-loading-spinner"></div>
          Loading batch match results...
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="batch-match-page">
      <div className="batch-match-container">
        <div className="batch-match-error-page">Error: {error}</div>
      </div>
    </div>
  );

  if (batchMatchResults.length === 0) return (
    <div className="batch-match-page">
      <div className="batch-match-container">
        <div className="batch-match-no-results">No batch match results found.</div>
      </div>
    </div>
  );

  return (
    <div className="batch-match-page">
      <div className="batch-match-container">
        <div className="batch-match-header">
          <h2 className="batch-match-title">Batch Resume-Job Match Results</h2>
          <p className="batch-match-subtitle">Analyzing multiple resumes for job compatibility</p>
        </div>
        <div className="batch-match-card">
          <ul className="batch-match-results">
            {batchMatchResults.map((result) => (
              <li key={result.resume_id} className={`batch-match-result-item ${result.error ? 'batch-match-error-item' : ''}`}>
                <div className={`batch-match-result-header ${result.error ? 'batch-match-error-header' : ''}`}>
                  <div className="batch-match-resume-info">
                    <div className={`batch-match-resume-icon ${result.error ? 'batch-match-error-icon' : ''}`}>
                      {result.error ? '!' : 'R'}
                    </div>
                    <h3 className="batch-match-resume-title">{resumesById[result.resume_id]?.file_name || `Resume ${result.resume_id}`}</h3>
                  </div>
                  {!result.error && (
                    <div className="batch-match-overall-score">
                      {result.match_score}%
                    </div>
                  )}
                </div>

                {result.error ? (
                  <div className="batch-match-error-content">
                    Error: {result.error}
                  </div>
                ) : (
                  <>
                    <div className="batch-match-scores-grid">
                      <div className="batch-match-score-card">
                        <div className="batch-match-score-label">Skills Score</div>
                        <div className="batch-match-score-value">{result.score_skills}</div>
                      </div>
                      <div className="batch-match-score-card">
                        <div className="batch-match-score-label">Experience Score</div>
                        <div className="batch-match-score-value">{result.score_experience}</div>
                      </div>
                    </div>
                    <div className="batch-match-summary">
                      <div className="batch-match-summary-title">Summary</div>
                      <p className="batch-match-summary-text">{result.summary}</p>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BatchResumeJobMatch;


