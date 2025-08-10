
const SET_ALL_SCORES = 'resumeJobScore/setAllScores';
const SET_SCORES_BY_JOB = 'resumeJobScore/setScoresByJob';
const SET_SCORES_BY_RESUMES = 'resumeJobScore/setScoresByResumes';
const SET_SCORE_BY_JOB_AND_RESUME = 'resumeJobScore/setScoreByJobAndResume';
const SET_ERROR = 'resumeJobScore/setError';
const CLEAR_ERROR = 'resumeJobScore/clearError';

const setAllScores = (scores) => ({
  type: SET_ALL_SCORES,
  payload: scores
});

const setScoresByJob = (scores) => ({
  type: SET_SCORES_BY_JOB,
  payload: scores
});

const setScoresByResumes = (scores) => ({
  type: SET_SCORES_BY_RESUMES,
  payload: scores
});

const setScoreByJobAndResume = (score) => ({
  type: SET_SCORE_BY_JOB_AND_RESUME,
  payload: score
});

const setError = (error) => ({
  type: SET_ERROR,
  payload: error
});

export const clearError = () => ({
  type: CLEAR_ERROR
});

export const thunkFetchAllScores = () => async (dispatch) => {
  try {
    const res = await fetch('/api/job-resume-scores/scores');
    if (res.ok) {
      const data = await res.json();
      dispatch(setAllScores(data.scores));
    } else {
      const error = await res.json();
      dispatch(setError(error));
    }
  } catch (e) {
    dispatch(setError({ server: e.message }));
  }
};

export const thunkFetchScoresByJob = (jobId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/job-resume-scores/jobs/${jobId}/scores`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setScoresByJob(data.scores));
    } else {
      const error = await res.json();
      dispatch(setError(error));
    }
  } catch (e) {
    dispatch(setError({ server: e.message }));
  }
};

export const thunkFetchScoresByResumes = () => async (dispatch) => {
  try {
    const res = await fetch('/api/job-resume-scores/resumes/scores');
    if (res.ok) {
      const data = await res.json();
      dispatch(setScoresByResumes(data.resume_scores));
    } else {
      const error = await res.json();
      dispatch(setError(error));
    }
  } catch (e) {
    dispatch(setError({ server: e.message }));
  }
};

export const thunkFetchScoreByJobAndResume = (jobId, resumeId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/job-resume-scores/jobs/${jobId}/resumes/${resumeId}/scores`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setScoreByJobAndResume(data.scores));
    } else {
      const error = await res.json();
      dispatch(setError(error));
    }
  } catch (e) {
    dispatch(setError({ server: e.message }));
  }
};

const initialState = {
  allScores: [],
  scoresByJob: [],
  scoresByResumes: {},
  scoreByJobAndResume: [],
  error: null
};

function resumeJobScoreReducer(state = initialState, action) {
  switch(action.type) {
    case SET_ALL_SCORES:
      return { ...state, allScores: action.payload, error: null };
    case SET_SCORES_BY_JOB:
      return { ...state, scoresByJob: action.payload, error: null };
    case SET_SCORES_BY_RESUMES:
      return { ...state, scoresByResumes: action.payload, error: null };
    case SET_SCORE_BY_JOB_AND_RESUME:
      return { ...state, scoreByJobAndResume: action.payload, error: null };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

export default resumeJobScoreReducer;
