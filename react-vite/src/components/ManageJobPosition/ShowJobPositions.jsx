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
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Job Positions</h1>
        <Link
          to="/joblist/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + New Job
        </Link>
      </div>
      <div className="space-y-4">
        {jobs.length === 0 && (
          <p className="text-gray-500">No jobs found. Create one!</p>
        )}
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-start border"
          >
            <div>
              <Link
                to={`/joblist/${job.id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {job.title}
              </Link>
              <p className="text-gray-600 mt-1 line-clamp-2">{job.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/joblist/edit/${job.id}`)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(job.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowJobPositions;

