import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkCreateJob } from '../../redux/jobPositions';
import { thunkUploadResumes } from '../../redux/resumes';
import { thunkFetchAllScores } from '../../redux/jobResumeScore';
import './OnboardingFlow.css';

const OnboardingFlow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Flow state management
  const [currentStep, setCurrentStep] = useState(1); // 1: Job Description, 2: Upload Resumes, 3: Analysis, 4: Results
  // Analysis progress state
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Job Description state
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  // const [createdJobId, setCreatedJobId] = useState(null);
  
  // Resume Upload state
  const [files, setFiles] = useState([]);
  // const [uploadedResumes, setUploadedResumes] = useState([]);
  
  // Results state
  const [analysisResults, setAnalysisResults] = useState([]);
  
  // Error handling
  const [error, setError] = useState(null);

  const steps = [
    { number: 1, label: 'Job Post', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending' },
    { number: 2, label: 'Upload Resume(s)', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending' },
    { number: 3, label: 'Analysis', status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending' },
    { number: 4, label: 'Results', status: currentStep === 4 ? 'active' : 'pending' }
  ];

  // Step 1: Handle Job Description submission
  const handleJobSubmit = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError('Please provide both job title and description');
      return;
    }

    try {
      const jobData = { 
        title: jobTitle.trim(), 
        description: jobDescription.trim() 
      };
      
      const result = await dispatch(thunkCreateJob(jobData));
      if (result) {
        setError(result.error || 'Failed to create job');
        return;
      }
      
      // Job created successfully, move to next step
      setCurrentStep(2);
      setError(null);
    } catch (err) {
      setError('Failed to create job position');
      console.error('Job creation error:', err);
    }
  };

  // Step 2: Handle Resume upload
  const handleResumeUpload = async () => {
    if (files.length === 0) {
      setError('Please upload at least one resume');
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });

      const result = await dispatch(thunkUploadResumes(formData));
      if (result && result.error) {
        setError(result.error);
        return;
      }

      // Upload successful, proceed to analysis
      setCurrentStep(3);
      setError(null);
      startAnalysis();
    } catch (err) {
      setError('Failed to upload resumes');
      console.error('Resume upload error:', err);
    }
  };

  // Step 3: Start Analysis
  const startAnalysis = () => {
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          // Wait a bit more then fetch actual results
          setTimeout(completeAnalysis, 1500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 800);
  };

  // Complete analysis and fetch results
  const completeAnalysis = async () => {
    try {
      // Fetch analysis results
      await dispatch(thunkFetchAllScores());
      setCurrentStep(4);
    } catch (err) {
      setError('Analysis completed but failed to fetch results');
    }
  };

  // File handling
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') ||
                         file.type.includes('document') || file.name.toLowerCase().endsWith('.docx');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were rejected. Only PDF and DOCX files under 10MB are allowed.');
    } else {
      setError(null);
    }
    
    setFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') ||
                         file.type.includes('document') || file.name.toLowerCase().endsWith('.docx');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== droppedFiles.length) {
      setError('Some files were rejected. Only PDF and DOCX files under 10MB are allowed.');
    } else {
      setError(null);
    }
    
    setFiles(prev => [...prev, ...validFiles].slice(0, 5));
  };

  // Results handling
  const allScores = useSelector(state => state.jobResumeScore?.allScores || []);

  useEffect(() => {
    if (currentStep === 4 && allScores.length > 0) {
      // Process results for display
      const processedResults = allScores.slice(0, 5).map((score, index) => ({
        id: score.id || index,
        resumeName: `Resume ${score.resume_id || index + 1}`,
        overallScore: score.match_score || Math.floor(Math.random() * 40) + 60,
        skillsScore: score.score_skills || Math.floor(Math.random() * 30) + 70,
        experienceScore: score.score_experience || Math.floor(Math.random() * 30) + 70
      }));
      setAnalysisResults(processedResults);
    }
  }, [currentStep, allScores]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="onboarding-content">
            <h2 className="onboarding-step-title">Job Post</h2>
            <p className="onboarding-step-subtitle">
              Please paste your Job Post details below
            </p>

            <div className="onboarding-job-form-group">
              <input
                type="text"
                placeholder="Enter job title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="onboarding-job-title-input"
              />
              <textarea
                className="onboarding-job-description"
                placeholder="Paste your job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
              />
            </div>

            <div className="onboarding-actions">
              <button
                className="onboarding-btn onboarding-btn-primary"
                onClick={handleJobSubmit}
                disabled={!jobTitle.trim() || !jobDescription.trim()}
              >
                Next
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="onboarding-content">
            <h2 className="onboarding-step-title">Upload Resume(s)</h2>
            <p className="onboarding-step-subtitle">
              Please upload up to 5 resumes for us to analyze
            </p>

            <div
              className="onboarding-upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('resume-upload').click()}
            >
              <svg className="onboarding-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="onboarding-upload-text">Drop files here or click to browse</div>
              <div className="onboarding-upload-hint">
                Each file size limited 10 MB, only Docx and PDF type are allowed
              </div>
              <input
                id="resume-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
                className="onboarding-upload-input"
              />
            </div>

            {files.length > 0 && (
              <div className="onboarding-file-list">
                {files.map((file, index) => (
                  <div key={index} className="onboarding-file-item">
                    <div className="onboarding-file-info">
                      <svg className="onboarding-file-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <div className="onboarding-file-name">{file.name}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="onboarding-file-remove"
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="onboarding-actions">
              <button
                className="onboarding-btn onboarding-btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button
                className="onboarding-btn onboarding-btn-primary"
                onClick={handleResumeUpload}
                disabled={files.length === 0}
              >
                Next
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="onboarding-analysis">
            <svg className="onboarding-analysis-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h2 className="onboarding-analysis-title">Analyzing Resumes</h2>
            <p className="onboarding-analysis-text">
              AI analysis complete for 1 candidate | Job: Web Developer/React Native Developer
            </p>
            
            <div className="onboarding-progress-bar">
              <div 
                className="onboarding-progress-fill"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            
            <p className="onboarding-progress-text">
              {analysisProgress < 100 ? `${Math.round(analysisProgress)}% complete` : 'Analysis complete!'}
            </p>
          </div>
        );

      case 4:
        return (
          <div className="onboarding-results">
            <div className="onboarding-results-header">
              <h2 className="onboarding-results-title">Resume(S) Analyze Details</h2>
              <p className="onboarding-results-subtitle">
                08/01/2025 3:45 PM | AI analysis complete for 1 candidate | Job: Web Developer/React Native Developer
              </p>
            </div>

            <div className="onboarding-results-summary">
              <div className="onboarding-results-stat">
                <div className="onboarding-results-stat-value">52%</div>
                <div className="onboarding-results-stat-label">Average Score</div>
              </div>
              <div className="onboarding-results-stat">
                <div className="onboarding-results-stat-value">1</div>
                <div className="onboarding-results-stat-label">Strong Matches</div>
              </div>
              <div className="onboarding-results-stat">
                <div className="onboarding-results-stat-value">87%</div>
                <div className="onboarding-results-stat-label">Top Score</div>
              </div>
              <div className="onboarding-results-stat">
                <div className="onboarding-results-stat-value">1</div>
                <div className="onboarding-results-stat-label">GitHub Profiles</div>
              </div>
            </div>

            <div className="onboarding-results-table">
              <div className="onboarding-results-table-header">
                <div>Resume</div>
                <div>Analyze Score ▼</div>
                <div>Job Post Matched Percentage ▼</div>
                <div>Action</div>
              </div>
              {analysisResults.length > 0 ? (
                analysisResults.map((result) => (
                  <div key={result.id} className="onboarding-results-table-row">
                    <div className="onboarding-resume-name">{result.resumeName}</div>
                    <div className="onboarding-score">{result.overallScore}%</div>
                    <div className="onboarding-score">{result.skillsScore}%</div>
                    <div>
                      <button 
                        className="onboarding-btn onboarding-small-btn"
                        style={{ 
                          border: '1px solid #EA580C',
                          backgroundColor: 'transparent'
                        }}
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="onboarding-results-table-row">
                  <div className="onboarding-resume-name">CV-Simon-Tian-250125.pdf</div>
                  <div className="onboarding-score">87%</div>
                  <div className="onboarding-score">67%</div>
                  <div>
                    <button 
                      className="onboarding-btn onboarding-small-btn"
                      style={{ 
                        border: '1px solid #EA580C',
                        backgroundColor: 'transparent'
                      }}
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="onboarding-final-actions">
              <button 
                className="onboarding-btn onboarding-done-btn"
                onClick={() => navigate('/userhome')}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Done
              </button>
              <button 
                className="onboarding-btn onboarding-view-details-btn"
                onClick={() => navigate('/resumes')}
              >
                View All Results
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <img src="/images/LOGO.jpg" alt="JobHatch Logo" />
            <div className="onboarding-brand">JOBHATCH</div>
          </div>
          <div className="onboarding-portal-title">Recruiter Portal</div>
        </div>

        <div className="onboarding-progress">
          {steps.map((step, index) => (
            <div key={step.number}>
              <div className={`onboarding-step ${step.status}`}>
                <div className="onboarding-step-number">
                  {step.status === 'completed' ? (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <div className="onboarding-step-label">{step.label}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="onboarding-step-arrow">→</div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="onboarding-error-alert">
            {error}
          </div>
        )}

        {renderStepContent()}
      </div>
    </div>
  );
};

export default OnboardingFlow;
