import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { thunkFetchAllScores, clearError } from '../../redux/jobResumeScore';

function MatchHistory() {
  const dispatch = useDispatch();

  const allScores = useSelector(state => state.resumeJobScore.allScores);
  const error = useSelector(state => state.resumeJobScore.error);

  useEffect(() => {
    dispatch(thunkFetchAllScores());

    return () => dispatch(clearError());
  }, [dispatch]);

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Match History</h2>
            <p className="text-red-600">{error.server || JSON.stringify(error)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!allScores || allScores.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Match History</h1>
            <p className="text-lg text-gray-600">View your AI-powered job-resume matching results</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Match History Yet</h2>
            <p className="text-gray-600 mb-6">
              Start by uploading resumes and job positions, then run AI matching to see results here.
            </p>
            <div className="space-y-3">
              <Link 
                to="/resumes/new"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors mr-4"
              >
                Upload Resume
              </Link>
              <Link 
                to="/joblist/new"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Add Job Position
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group by job_id
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

  // Convert to array and sort by job_id descending
  const jobsWithMatches = Array.from(jobsMap.values()).sort((a, b) => b.job_id - a.job_id);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Match History</h1>
          <p className="text-lg text-gray-600">
            View detailed AI matching results for all your job positions
          </p>
        </div>

        {/* Matches */}
        <div className="space-y-8">
          {jobsWithMatches.map(job => {
            // Sort matches by match_score descending
            const sortedMatches = job.matches
              ? [...job.matches].sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
              : [];

            return (
              <div key={job.job_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Job Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                  <h2 className="text-xl font-bold">💼 Job Position #{job.job_id}</h2>
                  <p className="text-blue-100">{sortedMatches.length} candidate matches found</p>
                </div>

                {/* Matches Content */}
                {!sortedMatches.length ? (
                  <div className="p-6 text-center text-gray-500">
                    No matches found for this job position.
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid gap-4">
                      {sortedMatches.map(score => {
                        // Find latest resume analysis
                        let latestAnalysis = null;
                        if (score.resume_analyses && score.resume_analyses.length > 0) {
                          latestAnalysis = [...score.resume_analyses].sort((a, b) => new Date(b.evaluated_at) - new Date(a.evaluated_at))[0];
                        }

                        return (
                          <div key={score.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {/* Resume Info & Scores */}
                              <div className="lg:col-span-1">
                                <h3 className="font-semibold text-gray-800 mb-2">📄 Resume #{score.resume_id}</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Match Score:</span>
                                    <span className={`font-medium ${(score.match_score || 0) >= 0.7 ? 'text-green-600' : (score.match_score || 0) >= 0.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {((score.match_score || 0) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Skills:</span>
                                    <span className="font-medium">{((score.score_skills || 0) * 100).toFixed(1)}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Experience:</span>
                                    <span className="font-medium">{((score.score_experience || 0) * 100).toFixed(1)}%</span>
                                  </div>
                                </div>
                              </div>

                              {/* Analysis Details */}
                              <div className="lg:col-span-2">
                                {latestAnalysis ? (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold text-gray-800">🤖 AI Analysis</h4>
                                      <span className="text-xs text-gray-500">
                                        {new Date(latestAnalysis.evaluated_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <div className="font-medium text-green-700 mb-1">✅ Strengths:</div>
                                        <p className="text-gray-600">{latestAnalysis.strengths || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <div className="font-medium text-red-700 mb-1">⚠️ Areas for Improvement:</div>
                                        <p className="text-gray-600">{latestAnalysis.weaknesses || 'N/A'}</p>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div className="font-medium text-blue-700 mb-1">💡 Suggestions:</div>
                                      <p className="text-gray-600 text-sm">{latestAnalysis.suggestions || 'N/A'}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center text-gray-500 py-4">
                                    <div className="text-2xl mb-2">📊</div>
                                    <p>No detailed analysis available</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <Link 
            to="/userhome"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MatchHistory;
