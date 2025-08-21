import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkMatchResumeToJob, clearMatchResult } from "../../redux/aiJobResumeScore";
import './ResumeJobMatch.css';

const ResumeJobMatch = () => {
  // Get jobId and resumeId from URL params
  const { jobId, resumeId } = useParams();

  const dispatch = useDispatch();
  const matchResult = useSelector(state => state.aijobResumeScore.currentMatch);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatch = async () => {
    setLoading(true);
    setError(null);
    const errorData = await dispatch(thunkMatchResumeToJob(jobId, resumeId));
    if (errorData) {
      setError(errorData.error || "Failed to fetch match result");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch if jobId and resumeId exist
    if (jobId && resumeId) {
      fetchMatch();
    } else {
      setError("Missing jobId or resumeId in URL");
      setLoading(false);
    }

    return () => {
      dispatch(clearMatchResult());
    };
  }, [dispatch, jobId, resumeId]);

  if (loading) return (
    <div className="resume-match-page">
      <div className="resume-match-container">
        <div className="resume-match-loading">
          <div className="resume-match-loading-spinner"></div>
          Loading match result...
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="resume-match-page">
      <div className="resume-match-container">
        <div className="resume-match-error">Error: {error}</div>
      </div>
    </div>
  );

  if (!matchResult) return (
    <div className="resume-match-page">
      <div className="resume-match-container">
        <div className="resume-match-no-result">No match result found.</div>
      </div>
    </div>
  );

  return (
    <div className="resume-match-page">
      <div className="resume-match-container">
        <div className="resume-match-card">
          <div className="resume-match-header">
            <h2 className="resume-match-title">Resume-Job Match Result</h2>
            <p className="resume-match-subtitle">AI-powered compatibility analysis</p>
          </div>
          <div className="resume-match-content">
            <div className="resume-match-score-grid">
              <div className="resume-match-score-card">
                <div className="resume-match-score-label">Match Score</div>
                <div className="resume-match-score-value">{matchResult.match_score}</div>
              </div>
              <div className="resume-match-score-card">
                <div className="resume-match-score-label">Skills Score</div>
                <div className="resume-match-score-value">{matchResult.score_skills}</div>
              </div>
              <div className="resume-match-score-card">
                <div className="resume-match-score-label">Experience Score</div>
                <div className="resume-match-score-value">{matchResult.score_experience}</div>
              </div>
            </div>
            <div className="resume-match-summary">
              <div className="resume-match-summary-title">Analysis Summary</div>
              <p className="resume-match-summary-text">{matchResult.summary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeJobMatch;

