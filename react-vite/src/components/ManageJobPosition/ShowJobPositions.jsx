import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import {
  thunkDeleteJob,
  thunkFetchAllJobs,
} from '../../redux/jobPositions';

const ShowJobPositions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobs = useSelector((state) => Object.values(state.jobs));

  useEffect(() => {
    dispatch(thunkFetchAllJobs());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (confirmed) {
      await dispatch(thunkDeleteJob(id));
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fff7e8' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Job Positions</h1>
          <Link
            to="/joblist/new"
            className="text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            style={{ backgroundColor: '#EA580C' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#EA580C'}
          >
            + New Job
          </Link>
        </div>
        <div className="space-y-4">
          {jobs.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-gray-500 text-lg">No jobs found. Create one!</p>
            </div>
          )}
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-start"
            >
              <div className="flex-1">
                <Link
                  to={`/joblist/${job.id}`}
                  className="text-xl font-semibold hover:underline"
                  style={{ color: '#EA580C' }}
                >
                  {job.title}
                </Link>
                <p className="text-gray-600 mt-2 line-clamp-3">{job.description}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Created: {new Date(job.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 ml-6">
                <button
                  onClick={() => navigate(`/joblist/edit/${job.id}`)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/jobs/${job.id}/resumes/select`)}
                  className="px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: '#10B981' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#10B981'}
                >
                  Match Resumes
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowJobPositions;

