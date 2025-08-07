import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkUploadResumes } from "../../redux/resumes";

const NewResumePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(1); // 1: upload, 2: job post, 3: analyzing
  const [jobPost, setJobPost] = useState('');

  const handleNext = () => {
    if (step === 1 && files.length > 0) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      // Simulate analyzing delay then navigate to results
      setTimeout(() => {
        navigate("/resumes/1/ai-score"); // Navigate to analysis results
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleNext();
  };

  // Remove a file from the list by its index
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Step 1: Upload Resumes
  if (step === 1) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
        <div className="flex items-center justify-center min-h-screen py-8">
          <div className="w-full max-w-lg mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Upload Resume(s)</h1>
              <p className="text-gray-600">Please upload up to 5 resumes for us to analyze</p>
            </div>

            {/* Upload Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit}>
                {/* File Upload Area */}
                {files.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center mb-6">
                    <div className="mb-4">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">Each file size limited 10 MB, only Docx and PDF type are allowed</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files);
                        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                        e.target.value = null;
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Click to upload or drag and drop
                    </label>
                  </div>
                ) : (
                  /* Selected Files Display */
                  <div className="mb-6">
                    <div className="space-y-3">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            onClick={() => removeFile(idx)}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center">
                  {files.length > 0 ? (
                    <div className="flex gap-4 w-full">
                      <button
                        type="button"
                        onClick={() => setFiles([])}
                        className="flex-1 px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-8 py-3 text-white rounded-lg font-semibold transition-colors"
                        style={{ backgroundColor: '#EA580C' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#EA580C'}
                      >
                        Next
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="w-full py-3 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Next
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Job Post Input
  if (step === 2) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
        <div className="flex items-center justify-center min-h-screen py-8">
          <div className="w-full max-w-lg mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Job Post</h1>
              <p className="text-gray-600">Please paste your Job Post details below</p>
            </div>

            {/* Job Post Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <textarea
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    value={jobPost}
                    onChange={(e) => setJobPost(e.target.value)}
                    placeholder="Paste job description here..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-3 text-white rounded-lg font-semibold transition-colors"
                    style={{ backgroundColor: jobPost.trim() ? '#EA580C' : '#9CA3AF' }}
                    disabled={!jobPost.trim()}
                  >
                    Next
                  </button>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => handleNext()}
                    className="text-gray-500 text-sm hover:text-gray-700"
                  >
                    Skip for now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Analyzing
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e8' }}>
      <div className="flex items-center justify-center min-h-screen py-8">
        <div className="w-full max-w-lg mx-auto px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">We are analyzing...</h1>
            <p className="text-lg text-gray-600 mb-8">Please give us a moment...</p>
            
            {/* Progress bar */}
            <div className="bg-gray-200 rounded-full h-4 mb-8 max-w-md mx-auto">
              <div
                className="h-4 rounded-full animate-pulse"
                style={{ backgroundColor: '#EA580C', width: '60%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewResumePage;


