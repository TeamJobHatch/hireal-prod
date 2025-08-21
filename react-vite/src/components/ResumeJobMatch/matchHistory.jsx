import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkFetchJobsWithMatches, clearError } from '../../redux/jobResumeScore';

function MatchHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobsWithMatches = useSelector(state => state.resumeJobScore.jobsWithMatches);
  const error = useSelector(state => state.resumeJobScore.error);

  const [expandedResumes, setExpandedResumes] = useState({});

  useEffect(() => {
    dispatch(thunkFetchJobsWithMatches());
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleAiScore = (resumeId) => {
    navigate(`/resumes/${resumeId}/ai-score`);
  };

  if (error) return (
    <div>
      <h2>Match History</h2>
      <div>Error: {error.server || JSON.stringify(error)}</div>
    </div>
  );

  if (!jobsWithMatches) return (
    <div>
      <h2>Match History</h2>
      <div>Loading matched jobs and resumes...</div>
    </div>
  );

  return (
    <div>
      <h2>Match History</h2>
      {jobsWithMatches.length === 0 ? (
        <div>No matched jobs found.</div>
      ) : (
        jobsWithMatches.map(job => {
          const sortedResumes = job.matched_resumes
            ? [...job.matched_resumes].sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
            : [];

          // 去重 resume 并保留最新分析
          const uniqueResumes = [];
          const seen = new Set();
          sortedResumes.forEach(resume => {
            if (!seen.has(resume.resume_id)) {
              seen.add(resume.resume_id);

              if (resume.resume_analyses && resume.resume_analyses.length > 1) {
                resume.resume_analyses = [...resume.resume_analyses]
                  .sort((a, b) => new Date(b.evaluated_at) - new Date(a.evaluated_at))
                  .slice(0, 1);
              }

              uniqueResumes.push(resume);
            }
          });

          return (
            <div key={job.job_id} className="job-section">
              <h3>{job.job_title}</h3>
              {!uniqueResumes.length ? (
                <p>No matches found for this job.</p>
              ) : (
                <table className="match-table border border-gray-300 w-full text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Resume Name</th>
                      <th className="p-2 border">Match Score</th>
                      <th className="p-2 border">Match Summary</th>
                      <th className="p-2 border">Resume Score</th>
                      <th className="p-2 border">Analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueResumes.map(resume => {
                      const latestAnalysis = resume.resume_analyses?.[0] || null;
                      const resumeKey = `${job.job_id}-${resume.resume_id}`;
                      const isExpanded = expandedResumes[resumeKey];

                      return (
                        <tr key={resume.resume_id} className="border-b">
                          {/* Resume Name */}
                          <td className="p-2 border">
                            {resume.resume_info ? (
                              <a
                                href={resume.resume_info.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                {resume.resume_info.file_name}
                              </a>
                            ) : (
                              `Resume ${resume.resume_id}`
                            )}
                          </td>

                          {/* Match Score */}
                          <td className="p-2 border">{resume.match_score?.toFixed(2)}</td>

                          {/* Match Summary */}
                          <td className="p-2 border">{resume.summary || 'N/A'}</td>

                          {/* Resume Score */}
                          <td className="p-2 border">
                            {latestAnalysis ? (
                              latestAnalysis.score_overall?.toFixed(2)
                            ) : (
                              <button
                                onClick={() => handleAiScore(resume.resume_id)}
                                className="px-2 py-1 bg-blue-500 text-white rounded"
                              >
                                AI Score
                              </button>
                            )}
                          </td>

                          {/* Analysis */}
                          <td className="p-2 border">
                            {latestAnalysis ? (
                              isExpanded ? (
                                <div>
                                  <div><b>Strengths:</b> {latestAnalysis.strengths}</div>
                                  <div><b>Weaknesses:</b> {latestAnalysis.weaknesses}</div>
                                  <div><b>Suggestions:</b> {latestAnalysis.suggestions}</div>
                                  <div><b>Positive Indicators:</b> {latestAnalysis.positive_indicators}</div>
                                  <div><b>Red Flags:</b> {latestAnalysis.red_flags}</div>
                                  <div className="text-gray-500 text-sm mt-1">
                                    Evaluated: {new Date(latestAnalysis.evaluated_at).toLocaleDateString()}
                                  </div>
                                  <button
                                    onClick={() =>
                                      setExpandedResumes(prev => ({ ...prev, [resumeKey]: false }))
                                    }
                                    className="mt-1 px-2 py-1 bg-gray-200 rounded"
                                  >
                                    Collapse Analysis
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    setExpandedResumes(prev => ({ ...prev, [resumeKey]: true }))
                                  }
                                  className="px-2 py-1 bg-gray-200 rounded"
                                >
                                  Expand Analysis
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => handleAiScore(resume.resume_id)}
                                className="px-2 py-1 bg-blue-500 text-white rounded"
                              >
                                AI Score
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default MatchHistory;

