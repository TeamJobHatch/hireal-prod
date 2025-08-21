
const SET_PLANS = 'plans/setAll';
const ADD_PLAN = 'plans/addOne';
const UPDATE_PLAN = 'plans/updateOne';
const DELETE_PLAN = 'plans/deleteOne';

// Action Creators
export const setPlans = (plans) => ({
  type: SET_PLANS,
  payload: plans,
});

export const addPlan = (plan) => ({
  type: ADD_PLAN,
  payload: plan,
});

export const updatePlan = (plan) => ({
  type: UPDATE_PLAN,
  payload: plan,
});

export const deletePlan = (planId) => ({
  type: DELETE_PLAN,
  payload: planId,
});

// Thunks

// 获取所有计划
export const thunkFetchPlans = () => async (dispatch) => {
  const res = await fetch('/api/plans/');
  if (res.ok) {
    const data = await res.json();
    dispatch(setPlans(data));
  }
};

// 创建新计划
export const thunkCreatePlan = (planData) => async (dispatch) => {
  const res = await fetch('/api/plans/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planData),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addPlan(data));
    return data;
  } else {
    const err = await res.json();
    throw err;
  }
};

// 更新已有计划
export const thunkUpdatePlan = (planId, data) => async (dispatch) => {
  const res = await fetch(`/api/plans/${planId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const updated = await res.json();
    dispatch(updatePlan(updated));
    return null;
  } else {
    const err = await res.json();
    return err;
  }
};

// 删除计划
export const thunkDeletePlan = (planId) => async (dispatch) => {
  const res = await fetch(`/api/plans/${planId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    dispatch(deletePlan(planId));
    return null;
  } else {
    const err = await res.json();
    return err;
  }
};

// Reducer
const initialState = {};

const plansReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLANS: {
      const newState = {};
      action.payload.forEach((plan) => {
        newState[plan.id] = plan;
      });
      return newState;
    }
    case ADD_PLAN: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case UPDATE_PLAN: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case DELETE_PLAN: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default plansReducer;
