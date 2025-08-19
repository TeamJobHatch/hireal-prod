
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchOneJob, thunkUpdateJob } from "../../redux/jobPositions";
import "./EditJobPosition.css";

const EditJobPosition = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const job = useSelector(state => state.jobs[id]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      if (!job) {
        const fetchedJob = await dispatch(thunkFetchOneJob(id));
        if (fetchedJob?.title) {
          setTitle(fetchedJob.title);
          setDescription(fetchedJob.description);
        }
      } else {
        setTitle(job.title);
        setDescription(job.description);
      }
    };
    fetchJob();
  }, [dispatch, id, job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(thunkUpdateJob(id, { title, description }));
    if (!result) {
      navigate("/joblist");
    }
  };

  return (
    <div className="edit-job-page">
      <div className="edit-job-container">
        <div className="edit-job-content">
          <div className="edit-job-card">
            <div className="edit-job-header">
              <h1 className="edit-job-title">Edit Job Position</h1>
            </div>
            <form onSubmit={handleSubmit} className="edit-job-form">
              <div className="job-form-group">
                <label className="job-form-label">Job Title</label>
                <input
                  className="job-form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter job title"
                  required
                />
              </div>
              <div className="job-form-group">
                <label className="job-form-label">Job Description</label>
                <textarea
                  className="job-form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter job description"
                  rows={5}
                />
              </div>
              <div className="job-form-actions">
                <button
                  type="submit"
                  className="save-job-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJobPosition;

