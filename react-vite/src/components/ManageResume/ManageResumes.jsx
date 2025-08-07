import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import {
  thunkFetchResumes,
  thunkDeleteResume
} from "../../redux/resumes";

const ManageResumes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const resumes = useSelector(state => Object.values(state.resumes));

  useEffect(() => {
    dispatch(thunkFetchResumes());
  }, [dispatch]);

  const handleDelete = async (resumeId) => {
    const confirmed = window.confirm("Are you sure you want to delete this resume?");
    if (confirmed) {
      await dispatch(thunkDeleteResume(resumeId));
    }
  };

  const handleAiScore = (resumeId) => {
    navigate(`/resumes/${resumeId}/ai-score`);
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fff7e8' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Resumes</h1>
          <Link to="/resumes/new">
            <button 
              className="text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              style={{ backgroundColor: '#EA580C' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#EA580C'}
            >
              + New Resume
            </button>
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No resumes uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map(resume => (
              <div key={resume.id} className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center">
                <div className="flex-1">
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold hover:underline"
                    style={{ color: '#EA580C' }}
                  >
                    {resume.file_name}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <Link to={`/resumes/${resume.id}/edit`}>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleAiScore(resume.id)}
                    className="px-4 py-2 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#8B5CF6' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#7C3AED'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#8B5CF6'}
                  >
                    AI Score
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageResumes;

