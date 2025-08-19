


import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewJobPosition from "../ManageJobPosition/NewJobPosition";
import NewResumePage from "../ManageResume/NewResumePage";
import { thunkBatchMatchSelectedResumes } from "../../redux/aiJobResumeScore";
import './OnboardingFlow.css';

const OnboardingFlow = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [job, setJob] = useState(null); 
  const [resumes, setResumes] = useState([]); 
  const [error, setError] = useState(null);

  const batchResults = useSelector(
    (state) => state.aijobResumeScore.batchMatchResults || []
  );

  const handleJobCreated = (createdJob) => {
    setJob(createdJob);
    setStep(2);
  };

  const handleResumesUploaded = (uploadedResumes) => {
    setResumes(uploadedResumes);
    setStep(3);
  };

 
  const handleRunAnalysis = async () => {
    if (!job || resumes.length === 0) {
      setError("Missing job or resumes");
      return;
    }

    const resumeIds = resumes.map(r => r.id);
    const result = await dispatch(thunkBatchMatchSelectedResumes(job.id, resumeIds));
    if (result?.error) {
      setError(result.error);
    } else {
      setStep(4);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">

        {/* Step 1: Create Job */}
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

        {/* Step 2: Upload Resumes */}
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

        {/* Step 3: Ready for Analysis */}
        {step === 3 && (
          <div className="onboarding-content">
            <div className="onboarding-step-title">Ready for Analysis</div>
            <div className="onboarding-step-subtitle">
              Ready to analyze {resumes.length} resume
              {resumes.length > 1 ? "s" : ""} for Job {job?.title || job?.id}?
              <ul>
                {resumes.map((r) => (
                  <li key={r.id}>{r.file_name}</li>
                ))}
              </ul>
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

        {/* Step 4: Analysis Results */}
        {step === 4 && (
          <div className="onboarding-content">
            <div className="onboarding-results-header">
              <div className="onboarding-results-title">Analysis Results</div>
              <div className="onboarding-results-subtitle">
                Here are your match results
              </div>
            </div>
            <div className="onboarding-results">
              {batchResults.length === 0 && <p>No results yet.</p>}
              <div className="onboarding-results-list">
                {batchResults.map((result) => (
                  <div key={result.resume_id} className="onboarding-result-item">
                    <div className="onboarding-result-info">
                      {/* 使用 resume_info.file_name，如果没有则显示 id */}
                      <span>{result.resume_info?.file_name || `Resume ${result.resume_id}`}</span>
                    </div>
                    <div className="onboarding-result-score">
                      Match Score: {result.match_score}%
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
