// Action types
const SET_USER_SUBSCRIPTION = "userSubscriptions/set";
const CLEAR_USER_SUBSCRIPTION = "userSubscriptions/clear";

// Action creators
const setUserSubscription = (subscription) => ({
  type: SET_USER_SUBSCRIPTION,
  payload: subscription,
});

export const clearUserSubscription = () => ({
  type: CLEAR_USER_SUBSCRIPTION,
});

// Thunks
export const thunkFetchMySubscription = () => async (dispatch) => {
  const res = await fetch("/api/subscriptions/me");

  if (res.ok) {
    const data = await res.json();
    dispatch(setUserSubscription(data));
    return data;
  } else {
    dispatch(clearUserSubscription());
    return null;
  }
};

// Reducer
const initialState = null; 

export default function userSubscriptionsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_SUBSCRIPTION:
      return action.payload;
    case CLEAR_USER_SUBSCRIPTION:
      return null;
    default:
      return state;
  }
}
