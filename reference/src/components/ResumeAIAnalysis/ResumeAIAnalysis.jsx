import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { thunkAnalyzeResume, clearAnalysis } from "../../redux/aiResumeAnalysis";
import "./ResumeAIAnalysis.css";

const ResumeAIAnalysis = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const analysis = useSelector((state) => state.aiResumeAnalysis.currentAnalysis);

  useEffect(() => {
    dispatch(clearAnalysis()); 
    dispatch(thunkAnalyzeResume(resumeId));
  }, [dispatch, resumeId]);

  const handleBack = () => {
    navigate("/resumes");
  };

  if (!analysis) {
    return (
      <div className="analysis-page">
        <div className="analysis-container">
          <div className="loading-section">
            <h2 className="loading-title">Analyzing Resume</h2>
            <p className="loading-subtitle">Please wait while our AI analyzes your resume...</p>
            <div className="progress-container">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <div className="analysis-container">
        <div className="analysis-header">
          <button onClick={handleBack} className="back-button">
            <span className="back-icon">←</span>
            Back to Resumes
          </button>
          <h1 className="page-title">AI Resume Analysis</h1>
        </div>

        <div className="analysis-card">
          <div className="card-header">
            <h2 className="card-title">Analysis Results</h2>
          </div>

          <div className="score-section">
            <div className="score-item">
              <div className="score-label">Overall Score</div>
              <div className="score-value">{analysis.score_overall}</div>
            </div>
            <div className="score-item">
              <div className="score-label">Format Score</div>
              <div className="score-value">{analysis.score_format}</div>
            </div>
            <div className="score-item">
              <div className="score-label">Skills Score</div>
              <div className="score-value">{analysis.score_skills}</div>
            </div>
            <div className="score-item">
              <div className="score-label">Experience Score</div>
              <div className="score-value">{analysis.score_experience}</div>
            </div>
          </div>

          <div className="analysis-section">
            <div className="analysis-item">
              <h3 className="analysis-label">Strengths</h3>
              <p className="analysis-text">{analysis.strengths || "N/A"}</p>
            </div>

            <div className="analysis-item">
              <h3 className="analysis-label">Weaknesses</h3>
              <p className="analysis-text">{analysis.weaknesses || "N/A"}</p>
            </div>

            <div className="analysis-item">
              <h3 className="analysis-label">Suggestions</h3>
              <p className="analysis-text">{analysis.suggestions || "N/A"}</p>
            </div>
          </div>

          <div className="action-section">
            <button
              onClick={handleBack}
              className="action-button primary"
            >
              Back to Resumes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAIAnalysis;
