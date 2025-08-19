import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkFetchAllScores, clearError } from '../../redux/jobResumeScore';
import './matchHistory.css';

function MatchHistory() {
  const dispatch = useDispatch();

  const allScores = useSelector(state => state.resumeJobScore.allScores);
  const error = useSelector(state => state.resumeJobScore.error);

  useEffect(() => {
    dispatch(thunkFetchAllScores());

    return () => dispatch(clearError());
  }, [dispatch]);

  if (error) return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">
          <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Match History
        </h2>
      </div>
      <div className="section-content">
        <div className="match-history-error">
          Error: {error.server || JSON.stringify(error)}
        </div>
      </div>
    </div>
  );

  // 按 job_id 分组
  const jobsMap = new Map();
  allScores.forEach(score => {
    if (!jobsMap.has(score.job_id)) {
      jobsMap.set(score.job_id, {
        job_id: score.job_id,
        matches: [],
      });
    }
    jobsMap.get(score.job_id).matches.push(score);
  });

  // 转成数组并按 job_id 降序排列
  const jobsWithMatches = Array.from(jobsMap.values()).sort((a, b) => b.job_id - a.job_id);

  // Handle loading state properly
  if (!allScores) return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">
          <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Match History
        </h2>
      </div>
      <div className="section-content">
        <div className="empty-state">
          <div className="empty-state-title">Loading Match History</div>
          <div className="empty-state-description">
            Loading matched jobs and resumes...
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">
          <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Match History
        </h2>
      </div>
      <div className="section-content">
        {jobsWithMatches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No Match History</div>
            <div className="empty-state-description">
              No matched jobs found. Start by creating a job and matching resumes to it.
            </div>
          </div>
        ) : (
          <div className="match-history-content">
            {jobsWithMatches.map(job => {
              // 当前 job 的 resumes 按 match_score 降序排序
              const sortedMatches = job.matches
                ? [...job.matches].sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
                : [];

              return (
                <div key={job.job_id} className="match-history-job-section">
                  <div className="match-history-job-header">
                    <div className="match-history-job-info">
                      <div className="match-history-job-icon">J</div>
                      <h3 className="match-history-job-title">Job {job.job_id}</h3>
                    </div>
                    <div className="match-history-job-id">Job #{job.job_id}</div>
                  </div>
                  {!sortedMatches.length ? (
                    <p className="match-history-empty">No matches found for this job.</p>
                  ) : (
                    <table className="match-history-table">
                      <thead>
                        <tr>
                          <th>Resume ID</th>
                          <th>Match Score</th>
                          <th>Skills Score</th>
                          <th>Experience Score</th>
                          <th>Latest Resume Analysis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedMatches.map(score => {
                          // 找出最新的 resume_analyses (按 evaluated_at 降序取第一个)
                          let latestAnalysis = null;
                          if (score.resume_analyses && score.resume_analyses.length > 0) {
                            latestAnalysis = [...score.resume_analyses].sort((a, b) => new Date(b.evaluated_at) - new Date(a.evaluated_at))[0];
                          }

                          return (
                            <tr key={score.id}>
                              <td className="match-history-resume-id">{score.resume_id}</td>
                              <td className="match-history-score">{score.match_score?.toFixed(2)}</td>
                              <td className="match-history-score">{score.score_skills?.toFixed(2)}</td>
                              <td className="match-history-score">{score.score_experience?.toFixed(2)}</td>
                              <td className="match-history-analysis">
                                {latestAnalysis ? (
                                  <div className="match-history-analysis-item">
                                    <div className="match-history-analysis-score">
                                      Overall: {latestAnalysis.score_overall?.toFixed(2)}
                                    </div>
                                    <div className="match-history-analysis-strengths">
                                      Strengths: {latestAnalysis.strengths || 'N/A'}
                                    </div>
                                    <div className="match-history-analysis-weaknesses">
                                      Weaknesses: {latestAnalysis.weaknesses || 'N/A'}
                                    </div>
                                    <div className="match-history-analysis-suggestions">
                                      Suggestions: {latestAnalysis.suggestions || 'N/A'}
                                    </div>
                                    <div className="match-history-analysis-date">
                                      Evaluated: {new Date(latestAnalysis.evaluated_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="match-history-no-analysis">No analysis available</div>
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchHistory;
