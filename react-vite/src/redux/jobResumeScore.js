// Redux store for job resume scores

const SET_ALL_SCORES = 'job-resume-score/SET_ALL_SCORES';
const SET_SCORES_BY_JOB = 'job-resume-score/SET_SCORES_BY_JOB';
const SET_SCORES_BY_RESUMES = 'job-resume-score/SET_SCORES_BY_RESUMES';
const SET_SCORE_BY_JOB_AND_RESUME = 'job-resume-score/SET_SCORE_BY_JOB_AND_RESUME';
const SET_JOBS_WITH_MATCHES = 'job-resume-score/SET_JOBS_WITH_MATCHES';
const SET_ERROR = 'job-resume-score/SET_ERROR';
const CLEAR_ERROR = 'job-resume-score/CLEAR_ERROR';

// Action creators
const setAllScores = (scores) => ({
  type: SET_ALL_SCORES,
  payload: scores,
});

const setScoresByJob = (jobId, scores) => ({
  type: SET_SCORES_BY_JOB,
  payload: { jobId, scores },
});

const setScoresByResumes = (resumeScores) => ({
  type: SET_SCORES_BY_RESUMES,
  payload: resumeScores,
});

const setScoreByJobAndResume = (jobId, resumeId, scores) => ({
  type: SET_SCORE_BY_JOB_AND_RESUME,
  payload: { jobId, resumeId, scores },
});

const setJobsWithMatches = (jobs) => ({
  type: SET_JOBS_WITH_MATCHES,
  payload: jobs,
});

const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

// Thunks
export const thunkFetchAllScores = () => async (dispatch) => {
  try {
    const response = await fetch('/api/job-resume-scores/scores');
    
    if (response.ok) {
      const data = await response.json();
      dispatch(setAllScores(data.scores));
    } else {
      const errorData = await response.json();
      dispatch(setError(errorData));
    }
  } catch (error) {
    dispatch(setError({ server: 'Network error occurred' }));
  }
};

export const thunkFetchScoresByJob = (jobId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/job-resume-scores/jobs/${jobId}/scores`);
    
    if (response.ok) {
      const data = await response.json();
      dispatch(setScoresByJob(jobId, data.scores));
    } else {
      const errorData = await response.json();
      dispatch(setError(errorData));
    }
  } catch (error) {
    dispatch(setError({ server: 'Network error occurred' }));
  }
};

export const thunkFetchScoresByResumes = () => async (dispatch) => {
  try {
    const response = await fetch('/api/job-resume-scores/resumes/scores');
    
    if (response.ok) {
      const data = await response.json();
      dispatch(setScoresByResumes(data.resume_scores));
    } else {
      const errorData = await response.json();
      dispatch(setError(errorData));
    }
  } catch (error) {
    dispatch(setError({ server: 'Network error occurred' }));
  }
};

export const thunkFetchScoreByJobAndResume = (jobId, resumeId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/job-resume-scores/jobs/${jobId}/resumes/${resumeId}/scores`);
    
    if (response.ok) {
      const data = await response.json();
      dispatch(setScoreByJobAndResume(jobId, resumeId, data.scores));
    } else {
      const errorData = await response.json();
      dispatch(setError(errorData));
    }
  } catch (error) {
    dispatch(setError({ server: 'Network error occurred' }));
  }
};

export const thunkFetchJobsWithMatches = () => async (dispatch) => {
  try {
    const response = await fetch('/api/job-resume-scores/user/jobs-with-matches');
    
    if (response.ok) {
      const data = await response.json();
      dispatch(setJobsWithMatches(data.jobs));
    } else {
      const errorData = await response.json();
      dispatch(setError(errorData));
    }
  } catch (error) {
    dispatch(setError({ server: 'Network error occurred' }));
  }
};

// Initial state
const initialState = {
  allScores: [],
  scoresByJob: {},
  scoresByResumes: {},
  scoreByJobAndResume: {},
  jobsWithMatches: [],
  error: null,
};

// Reducer
export default function jobResumeScoreReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_SCORES:
      return {
        ...state,
        allScores: action.payload,
        error: null,
      };
    case SET_SCORES_BY_JOB:
      return {
        ...state,
        scoresByJob: {
          ...state.scoresByJob,
          [action.payload.jobId]: action.payload.scores,
        },
        error: null,
      };
    case SET_SCORES_BY_RESUMES:
      return {
        ...state,
        scoresByResumes: action.payload,
        error: null,
      };
    case SET_SCORE_BY_JOB_AND_RESUME: {
      const { jobId, resumeId, scores } = action.payload;
      return {
        ...state,
        scoreByJobAndResume: {
          ...state.scoreByJobAndResume,
          [`${jobId}_${resumeId}`]: scores,
        },
        error: null,
      };
    }
    case SET_JOBS_WITH_MATCHES:
      return {
        ...state,
        jobsWithMatches: action.payload,
        error: null,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
