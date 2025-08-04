import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkUpdateResume,
  thunkFetchResumes
} from "../../redux/resumes";

const EditResumePage = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resume = useSelector(state => state.resumes[resumeId]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!resume) {
      dispatch(thunkFetchResumes());
    } else {
      setName(resume.file_name || "");
    }
  }, [resume, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file_name", name);

    const res = await dispatch(thunkUpdateResume(resumeId, formData));
    if (!res) {
      navigate("/resumes");
    } else {
      alert("Update failed: " + JSON.stringify(res));
    }
  };

  if (!resume) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Resume Name</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Resume Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditResumePage;
