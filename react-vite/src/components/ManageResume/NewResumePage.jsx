import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkUploadResumes } from "../../redux/resumes";
import './NewResumePage.css';

const NewResumePage = ({ fromOnboarding = false, onComplete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    e.target.value = null;
  };

  return (
    <div className="upload-page">
      <div className={`upload-container ${!fromOnboarding ? 'offset-top' : ''}`}>
        <div className="upload-content">
          <div className="upload-card">
            <div className="upload-header">
              <h2 className="upload-title">Upload New Resume(s)</h2>
            </div>
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="upload-field-wrapper">
                <div 
                  className={`upload-field ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="upload-field-input"
                  />
                  
                  {files.length === 0 ? (
                    <div className="upload-field-content">
                      <svg className="upload-field-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="upload-field-text">
                        <div className="upload-field-secondary">Drag and drop files here, or click to browse</div>
                        <div className="upload-field-secondary">Supports .pdf and .docx files</div>
                      </div>
                      <button type="button" className="upload-field-button">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Choose Files
                      </button>
                    </div>
                  ) : (
                    <div className="upload-field-content">
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
                      <button type="button" className="upload-field-button">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add More Files
                      </button>
                    </div>
                  )}
                </div>
              </div>

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

