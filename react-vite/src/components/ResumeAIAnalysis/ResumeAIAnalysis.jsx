import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { thunkAnalyzeResume, clearAnalysis } from "../../redux/aiResumeAnalysis";

const ResumeAIAnalysis = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const analysis = useSelector((state) => state.aiResumeAnalysis.currentAnalysis);

  useEffect(() => {
    dispatch(clearAnalysis()); 
    dispatch(thunkAnalyzeResume(resumeId));
  }, [dispatch, resumeId]);

  const handleBack = () => {
    navigate("/resumes");
  };

  if (!analysis) return <p className="p-6">Analyzing resume... please wait.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">AI Resume Analysis</h2>

      <div className="mb-4">
        <h3 className="font-semibold">Overall Score: {analysis.score_overall}</h3>
        <p>Format Score: {analysis.score_format}</p>
        <p>Skills Score: {analysis.score_skills}</p>
        <p>Experience Score: {analysis.score_experience}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Strengths</h3>
        <p>{analysis.strengths || "N/A"}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Weaknesses</h3>
        <p>{analysis.weaknesses || "N/A"}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Suggestions</h3>
        <p>{analysis.suggestions || "N/A"}</p>
      </div>

      <button
        onClick={handleBack}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Resumes
      </button>
    </div>
  );
};

export default ResumeAIAnalysis;
