import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { thunkAnalyzeResume, clearAnalysis } from "../../redux/aiResumeAnalysis";

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

  // Loading state
  if (!analysis) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Analyzing Resume...</h1>
            <p className="text-gray-600 mb-6">
              Our AI is carefully analyzing the resume. This may take a few moments.
            </p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            
            <button
              onClick={handleBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Cancel & Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Resumes
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🤖</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Resume Analysis</h1>
          <p className="text-lg text-gray-600">
            Detailed analysis results for Resume #{resumeId}
          </p>
        </div>

        {/* Analysis Results */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
            <h2 className="text-xl font-bold">Analysis Complete</h2>
            <p className="text-orange-100">
              Evaluated on {analysis.evaluated_at ? new Date(analysis.evaluated_at).toLocaleDateString() : 'Today'}
            </p>
          </div>

          {/* Scores Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  (analysis.score_overall || 0) >= 0.8 ? 'text-green-600' : 
                  (analysis.score_overall || 0) >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round((analysis.score_overall || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round((analysis.score_format || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Format Quality</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.round((analysis.score_skills || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Skills Match</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {Math.round((analysis.score_experience || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Experience Level</div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  ✅ Strengths
                </h3>
                <p className="text-green-700">{analysis.strengths || 'No specific strengths identified.'}</p>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                  ⚠️ Areas for Improvement
                </h3>
                <p className="text-red-700">{analysis.weaknesses || 'No specific weaknesses identified.'}</p>
              </div>

              {/* Positive Indicators */}
              {analysis.positive_indicators && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    ⭐ Positive Indicators
                  </h3>
                  <p className="text-blue-700">{analysis.positive_indicators}</p>
                </div>
              )}

              {/* Red Flags */}
              {analysis.red_flags && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                    🚩 Red Flags
                  </h3>
                  <p className="text-yellow-700">{analysis.red_flags}</p>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                💡 Suggestions for Improvement
              </h3>
              <p className="text-gray-700">{analysis.suggestions || 'No specific suggestions available.'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/resumes"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Resumes
          </Link>
          <Link
            to="/userhome"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumeAIAnalysis;