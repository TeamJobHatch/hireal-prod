// Action Types
const SET_RESUMES = 'resumes/setAll';
const ADD_RESUMES = 'resumes/addBatch';
const UPDATE_RESUME = 'resumes/updateOne';
const DELETE_RESUME = 'resumes/deleteOne';

// Action Creators
const setResumes = (resumes) => ({
  type: SET_RESUMES,
  payload: resumes
});

const addResumes = (resumes) => ({
  type: ADD_RESUMES,
  payload: resumes
});

const updateResume = (resume) => ({
  type: UPDATE_RESUME,
  payload: resume
});

const deleteResume = (resumeId) => ({
  type: DELETE_RESUME,
  payload: resumeId
});

// Thunks

export const thunkFetchResumes = () => async (dispatch) => {
  const res = await fetch('/api/resumes');
  if (res.ok) {
    const data = await res.json();
    dispatch(setResumes(data.resumes));
  }
};

export const thunkUploadResumes = (formData) => async (dispatch) => {
  const res = await fetch('/api/resumes', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addResumes(data.resumes));
    return data.resumes;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

export const thunkUpdateResume = (resumeId, formData) => async (dispatch) => {
  const res = await fetch(`/api/resumes/${resumeId}`, {
    method: 'PUT',
    body: formData
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(updateResume(data.resume));
    return data.resume;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

export const thunkDeleteResume = (resumeId) => async (dispatch) => {
  const res = await fetch(`/api/resumes/${resumeId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(deleteResume(resumeId));
    return { success: true };
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

// Reducer

const initialState = {};

const resumesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RESUMES: {
      const newState = {};
      action.payload.forEach((resume) => {
        newState[resume.id] = resume;
      });
      return newState;
    }
    case ADD_RESUMES: {
      const newState = { ...state };
      action.payload.forEach((resume) => {
        newState[resume.id] = resume;
      });
      return newState;
    }
    case UPDATE_RESUME:
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    case DELETE_RESUME: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default resumesReducer;
