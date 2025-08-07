import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { thunkAnalyzeResume, clearAnalysis } from "../../redux/aiResumeAnalysis";

const ResumeAIAnalysis = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showJobPost, setShowJobPost] = useState(false);

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
      <div className="min-h-screen py-8" style={{ backgroundColor: '#fff7e8' }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">We are analyzing...</h1>
            <p className="text-lg text-gray-600 mb-8">Please give us a moment...</p>
            
            {/* Progress bar */}
            <div className="bg-gray-200 rounded-full h-3 mb-8 max-w-md mx-auto">
              <div
                className="h-3 rounded-full animate-pulse"
                style={{ backgroundColor: '#EA580C', width: '30%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fff7e8' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Resume(S) Analyze Result</h1>
        </div>

        {/* Grid layout for dates */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            ['08/01/2025', '3:45 PM'],
            ['07/21/2025', '2:45 PM'], 
            ['07/11/2025', '1:45 PM'],
            ['07/09/2025', '12:45 PM'],
            ['08/01/2024', '3:45 PM'],
            ['07/21/2024', '2:45 PM'],
            ['07/11/2024', '1:45 PM'],
            ['07/09/2024', '12:45 PM'],
            ['08/01/2023', '3:45 PM'],
            ['07/21/2023', '2:45 PM'],
            ['07/11/2023', '1:45 PM'],
            ['07/09/2023', '12:45 PM'],
            ['08/01/2022', '3:45 PM'],
            ['07/21/2022', '2:45 PM'],
            ['07/11/2022', '1:45 PM'],
            ['07/09/2022', '12:45 PM']
          ].map(([date, time], index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm text-center border">
              <div className="text-gray-700 font-medium text-sm">{date}</div>
              <div className="text-gray-500 text-xs">{time}</div>
            </div>
          ))}
        </div>

        {/* Analysis Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Resume(S) Analyze Details</h2>
            <button 
              onClick={() => setShowJobPost(true)}
              className="px-6 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
            >
              View Pasted Job Post
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">08/01/2025 3:45 PM</h3>
            
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 mb-4 text-sm font-medium text-gray-600 border-b pb-2">
              <div>Resume</div>
              <div>Analyze Score ▼</div>
              <div>Job Post Matched Percentage ▼</div>
              <div>Action</div>
            </div>

            {/* Sample resume row */}
            <div className="grid grid-cols-4 gap-4 py-3 border-b">
              <div className="text-orange-500">CV-Simon-Tian-250125.pdf</div>
              <div className="font-semibold">{analysis.score_overall || '87'}</div>
              <div className="font-semibold">87%</div>
              <div>
                <button className="text-orange-500 hover:text-orange-600">View Detail</button>
              </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h3>
            <p className="text-gray-600 mb-6">
              AI analysis complete for 1 candidate | Job: Web Developer/React Native Developer
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">52%</div>
                <div className="text-gray-600">Average Score</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">1</div>
                <div className="text-gray-600">Strong Matches</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">87%</div>
                <div className="text-gray-600">Top Score</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">1</div>
                <div className="text-gray-600">GitHub Profiles</div>
              </div>
            </div>

            {/* Export Button */}
            <div className="text-center mb-8">
              <button
                className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export Results
              </button>
            </div>

            {/* Candidate Details */}
            <div className="flex items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mr-6">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.242l3 2A1 1 0 0117 5v10a3 3 0 01-3 3H6a3 3 0 01-3-3V5a1 1 0 01.033-.758l3-2A1 1 0 017 2h5zm-1 9a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900">Rank 1</div>
              </div>
              <div className="ml-8 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Simon Tian</h4>
                    <p className="text-gray-600">jt886@cornell.edu</p>
                    <p className="text-orange-500 text-sm">CV-Simon-Tian-250125.pdf</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <span className="text-sm">▼ Expand</span>
                  </button>
                </div>
                <div className="flex space-x-6 mt-4">
                  <div className="text-center">
                    <div className="font-semibold">Overall: {analysis.score_overall || '87'}%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">Skills: {analysis.score_skills || '70'}%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">Experience: {analysis.score_experience || '70'}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          {analysis.strengths && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Strengths</h3>
              <p className="text-gray-600">{analysis.strengths}</p>
            </div>
          )}

          {analysis.weaknesses && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Weaknesses</h3>
              <p className="text-gray-600">{analysis.weaknesses}</p>
            </div>
          )}

          {analysis.suggestions && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Suggestions</h3>
              <p className="text-gray-600">{analysis.suggestions}</p>
            </div>
          )}
        </div>

        {/* Job Post Modal */}
        {showJobPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
            <div className="bg-white w-96 h-full overflow-y-auto shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-blue-600">Pasted Job Post</h3>
                  <button
                    onClick={() => setShowJobPost(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="prose prose-sm text-gray-700">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut laoreet leo. Duis placerat consequat nulla ut auctor. Curabitur sem ipsum, efficitur id dui vitae, rhoncus ornare ex. Nulla mauris lacus, mollis ut est ac, sollicitudin volutpat quam. Ut non accumsan dolor. Vestibulum tempor in velit et ornare. Donec aliquet accumsan justo sit amet laoreet. Suspendisse vitae ipsum id nibh varius convallis non id diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam cursus elit nisl. Aliquam sed lobortis nulla. Donec eu consectetur leo. Pellentesque augue mauris, hendrerit a varius quis, varius eget erat. Aliquam posuere ipsum nec condimentum dictum. Suspendisse potenti. Integer quis pretium risus, sit amet viverra massa.
                  </p>
                  <p>
                    Quisque et blandit sem. Vestibulum ac tortor quis lacus mollis efficitur. Nulla sit amet nisl sed metus pellentesque auctor. Suspendisse ipsum enim, vestibulum nec placerat in, viverra vitae neque. Sed a rutrum quam, quis dignissim neque. In pellentesque tincidunt est id maximus. Integer non aliquam ipsum. Cras quis dictum arcu, eu suscipit diam. Vivamus commodo at sem eget sollicitudin. Sed convallis efficitur egestas. Duis hendrerit sem metus, at laoreet ex interdum ac. Phasellus scelerisque pretium massa id condimentum. Suspendisse potenti. Integer quis pretium risus, sit amet viverra massa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAIAnalysis;
