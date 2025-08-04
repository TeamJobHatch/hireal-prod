// Action Types
const SET_MATCH_RESULT = "jobResumeScore/setMatchResult";
const CLEAR_MATCH_RESULT = "jobResumeScore/clearMatchResult";

const SET_BATCH_MATCH_RESULTS = "jobResumeScore/setBatchMatchResults";
const CLEAR_BATCH_MATCH_RESULTS = "jobResumeScore/clearBatchMatchResults";

// Action Creators
const setMatchResult = (result) => ({
  type: SET_MATCH_RESULT,
  payload: result,
});

export const clearMatchResult = () => ({
  type: CLEAR_MATCH_RESULT,
});

const setBatchMatchResults = (results) => ({
  type: SET_BATCH_MATCH_RESULTS,
  payload: results,
});

export const clearBatchMatchResults = () => ({
  type: CLEAR_BATCH_MATCH_RESULTS,
});

// Thunk for single resume-job matching
export const thunkMatchResumeToJob = (jobId, resumeId) => async (dispatch) => {
  const res = await fetch(`/api/ai/jobs/${jobId}/resumes/${resumeId}/match`, {
    method: "POST",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setMatchResult(data));
    return null;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

// Thunk for batch resume-job matching
export const thunkBatchMatchSelectedResumes = (jobId, resumeIds) => async (dispatch) => {
  const res = await fetch(`/api/ai/jobs/${jobId}/resumes/match_batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_ids: resumeIds }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(setBatchMatchResults(data.results));
    return null;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

// Initial state
const initialState = {
  currentMatch: null,          // 单条匹配结果
  batchMatchResults: [],       // 批量匹配结果数组
};

// Reducer
const jobResumeScoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MATCH_RESULT:
      return {
        ...state,
        currentMatch: action.payload,
      };
    case CLEAR_MATCH_RESULT:
      return {
        ...state,
        currentMatch: null,
      };
    case SET_BATCH_MATCH_RESULTS:
      return {
        ...state,
        batchMatchResults: action.payload,
      };
    case CLEAR_BATCH_MATCH_RESULTS:
      return {
        ...state,
        batchMatchResults: [],
      };
    default:
      return state;
  }
};

export default jobResumeScoreReducer;

