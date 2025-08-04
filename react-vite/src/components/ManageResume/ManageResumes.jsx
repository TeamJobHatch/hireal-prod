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
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Resumes</h2>
        <Link to="/resumes/new">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + New Resume
          </button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <p className="text-gray-500">No resumes uploaded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white rounded shadow">
          {resumes.map(resume => (
            <li key={resume.id} className="flex justify-between items-center px-4 py-3">
              <div>
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {resume.file_name}
                </a>
                <p className="text-sm text-gray-500">
                  {new Date(resume.uploaded_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/resumes/${resume.id}/edit`}>
                  <button className="text-blue-600 hover:underline">Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAiScore(resume.id)}
                  className="text-purple-600 hover:underline"
                >
                  AI Score
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageResumes;

