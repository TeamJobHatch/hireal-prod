// Action Types
const SET_JOB_POSITIONS = 'jobs/setAll';
const ADD_JOB_POSITION = 'jobs/addOne';
const UPDATE_JOB_POSITION = 'jobs/updateOne';
const DELETE_JOB_POSITION = 'jobs/deleteOne';

// Action Creators
const setJobPositions = (jobs) => ({
  type: SET_JOB_POSITIONS,
  payload: jobs
});

const addJobPosition = (job) => ({
  type: ADD_JOB_POSITION,
  payload: job
});

const updateJobPosition = (job) => ({
  type: UPDATE_JOB_POSITION,
  payload: job
});

const deleteJobPosition = (jobId) => ({
  type: DELETE_JOB_POSITION,
  payload: jobId
});

// Thunks

export const thunkFetchAllJobs = () => async (dispatch) => {
  const res = await fetch('/api/jobs');
  if (res.ok) {
    const jobs = await res.json();
    dispatch(setJobPositions(jobs));
  } else {
    console.error('Failed to load job positions');
  }
};

export const thunkFetchOneJob = (id) => async () => {
  const res = await fetch(`/api/jobs/${id}`);
  if (res.ok) {
    return await res.json(); // optional for detail view
  } else {
    return { error: 'Not found or unauthorized' };
  }
};

export const thunkCreateJob = (jobData) => async (dispatch) => {
  const res = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });

  if (res.ok) {
    const newJob = await res.json();
    dispatch(addJobPosition(newJob));
    return null;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

export const thunkUpdateJob = (id, jobData) => async (dispatch) => {
  const res = await fetch(`/api/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });

  if (res.ok) {
    const updatedJob = await res.json();
    dispatch(updateJobPosition(updatedJob));
    return null;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

export const thunkDeleteJob = (id) => async (dispatch) => {
  const res = await fetch(`/api/jobs/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(deleteJobPosition(id));
    return null;
  } else {
    return { error: 'Delete failed or unauthorized' };
  }
};

// Reducer
const initialState = {};

const jobPositionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_JOB_POSITIONS: {
      const jobMap = {};
      action.payload.forEach(job => {
        jobMap[job.id] = job;
      });
      return jobMap;
    }

    case ADD_JOB_POSITION:
      return { ...state, [action.payload.id]: action.payload };

    case UPDATE_JOB_POSITION:
      return { ...state, [action.payload.id]: action.payload };

    case DELETE_JOB_POSITION: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }

    default:
      return state;
  }
};

export default jobPositionsReducer;

