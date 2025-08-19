import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewJobPosition from "../ManageJobPosition/NewJobPosition";
import NewResumePage from "../ManageResume/NewResumePage";
import { thunkBatchMatchSelectedResumes } from "../../redux/aiJobResumeScore";
import './OnboardingFlow.css';

const OnboardingFlow = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [jobId, setJobId] = useState(null);
  const [resumeIds, setResumeIds] = useState([]);
  const [error, setError] = useState(null);

  const batchResults = useSelector(
    (state) => state.aijobResumeScore.batchMatchResults
  );

  const handleJobCreated = (createdJobId) => {
    setJobId(createdJobId);
    setStep(2);
  };

  const handleResumesUploaded = (uploadedResumeIds) => {
    setResumeIds(uploadedResumeIds);
    setStep(3);
  };

  const handleRunAnalysis = async () => {
    if (!jobId || resumeIds.length === 0) {
      setError("Missing jobId or resumeIds");
      return;
    }

    const result = await dispatch(thunkBatchMatchSelectedResumes(jobId, resumeIds));
    if (result?.error) {
      setError(result.error);
    } else {
      setStep(4);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {step === 1 && (
          <div className="onboarding-content">
            <div className="onboarding-step-subtitle">
              Let us start by creating a job position to match against
            </div>
            <NewJobPosition
              fromOnboarding={true}
              onComplete={handleJobCreated}
            />
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-content">
            <div className="onboarding-step-subtitle">
              Upload one or more resumes to analyze
            </div>
            <NewResumePage
              fromOnboarding={true}
              onComplete={handleResumesUploaded}
            />
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-content">
            <div className="onboarding-step-title">Ready for Analysis</div>
            <div className="onboarding-step-subtitle">
              Ready to analyze {resumeIds.length} resume
              {resumeIds.length > 1 ? "s" : ""} for Job {jobId}?
            </div>
            <div className="onboarding-actions">
              <button
                className="onboarding-btn onboarding-btn-primary"
                onClick={handleRunAnalysis}
              >
                Run Analysis
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="onboarding-content">
            <div className="onboarding-results-header">
              <div className="onboarding-results-title">Analysis Results</div>
              <div className="onboarding-results-subtitle">Here are your match results</div>
            </div>
            <div className="onboarding-results">
              {batchResults.length === 0 && <p>No results yet.</p>}
              <div className="onboarding-results-list">
                {batchResults.map((result, idx) => (
                  <div key={idx} className="onboarding-result-item">
                    <div className="onboarding-result-info">
                      <span>Resume {result.resume_id}</span>
                    </div>
                    <div className="onboarding-result-score">
                      Match Score: {result.match_score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="onboarding-error-alert">{error}</div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
