import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkUploadResumes } from "../../redux/resumes";
import './NewResumePage.css';

const NewResumePage = ({ fromOnboarding = false, onComplete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one file");

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    const uploadedResumes = await dispatch(thunkUploadResumes(formData));
    console.log("Upload result:", uploadedResumes);

    if (!uploadedResumes || uploadedResumes.error) {
      alert("Upload failed: " + JSON.stringify(uploadedResumes));
      return;
    }

    if (fromOnboarding && onComplete) {
      const uploadedIds = uploadedResumes.map((r) => r.id);
      onComplete(uploadedIds); 
    } else {
      navigate("/resumes");
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-content">
          <div className="upload-header">
            <h2 className="upload-title">Upload New Resume(s)</h2>
            <p className="upload-subtitle">Select one or more resume files to upload</p>
          </div>
          <div className="upload-card">
            <form onSubmit={handleSubmit} className="upload-form">
              <div>
                <label className="upload-form-label">Select One or More Files (.pdf,.doc,.docx)</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                    e.target.value = null;
                  }}
                  className="upload-form-input"
                />
              </div>

              {files.length > 0 && (
                <div className="files-list">
                  <div className="files-container">
                    {files.map((file, idx) => (
                      <div key={idx} className="file-item">
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => removeFile(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="upload-actions">
                <button
                  type="submit"
                  className="upload-button"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewResumePage;

