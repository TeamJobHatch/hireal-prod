
const SET_ANALYSIS = "aiResumeAnalysis/set";
const CLEAR_ANALYSIS = "aiResumeAnalysis/clear";

// Action Creators
const setAnalysis = (analysis) => ({
  type: SET_ANALYSIS,
  payload: analysis,
});

export const clearAnalysis = () => ({
  type: CLEAR_ANALYSIS,
});

// Thunk for calling AI Resume Analysis API
export const thunkAnalyzeResume = (resumeId) => async (dispatch) => {
  const res = await fetch(`/api/ai/resumes/${resumeId}/analyze`, {
    method: "POST",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setAnalysis(data.analysis));
    return null;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

// Initial state
const initialState = {
  currentAnalysis: null,
};

// Reducer
const aiResumeAnalysisReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ANALYSIS:
      return {
        ...state,
        currentAnalysis: action.payload,
      };
    case CLEAR_ANALYSIS:
      return {
        ...state,
        currentAnalysis: null,
      };
    default:
      return state;
  }
};

export default aiResumeAnalysisReducer;
