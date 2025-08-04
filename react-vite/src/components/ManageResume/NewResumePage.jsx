import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkUploadResumes } from "../../redux/resumes";

const NewResumePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one file");

    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file); // Append each file under the "file" field
    }

    const res = await dispatch(thunkUploadResumes(formData));
    if (!res) {
      navigate("/resumes");
    } else {
      alert("Upload failed: " + JSON.stringify(res));
    }
  };

  // Remove a file from the list by its index
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload New Resume(s)</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Select One or More Files (.pdf,.doc,.docx)</label>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            // Append newly selected files to the existing list
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            e.target.value = null; // Reset input to allow selecting the same file again
          }}
          className="mb-4"
        />

        {/* Display the list of selected files */}
        {files.length > 0 && (
          <ul className="mb-4">
            {files.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{file.name}</span>
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => removeFile(idx)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default NewResumePage;


