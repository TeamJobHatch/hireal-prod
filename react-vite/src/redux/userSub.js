const SET_MY_SUBSCRIPTION = "userSubscription/setMySubscription";
const SET_SUBSCRIPTION_ERROR = "userSubscription/setError";
const CLEAR_SUBSCRIPTION_ERROR = "userSubscription/clearError";

const setMySubscription = (subscription) => ({
  type: SET_MY_SUBSCRIPTION,
  payload: subscription,
});

const setSubscriptionError = (error) => ({
  type: SET_SUBSCRIPTION_ERROR,
  payload: error,
});

export const clearSubscriptionError = () => ({
  type: CLEAR_SUBSCRIPTION_ERROR,
});

export const thunkFetchMySubscription = () => async (dispatch) => {
  try {
    const res = await fetch("/api/subscriptions/me");
    if (res.ok) {
      const data = await res.json();
      dispatch(setMySubscription(data));
    } else {
      const error = await res.json();
      dispatch(setSubscriptionError(error));
    }
  } catch (error) {
    dispatch(setSubscriptionError({ message: "Network error" }));
  }
};

export const thunkCreateSubscription = (planId) => async (dispatch) => {
  try {
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan_id: planId }),
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(setMySubscription(data));
    } else {
      const error = await res.json();
      dispatch(setSubscriptionError(error));
    }
  } catch (error) {
    dispatch(setSubscriptionError({ message: "Network error" }));
  }
};

export const thunkUpdateSubscription = (subscriptionData) => async (dispatch) => {
  try {
    const res = await fetch("/api/subscriptions/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(setMySubscription(data));
    } else {
      const error = await res.json();
      dispatch(setSubscriptionError(error));
    }
  } catch (error) {
    dispatch(setSubscriptionError({ message: "Network error" }));
  }
};

export const thunkCancelSubscription = () => async (dispatch) => {
  try {
    const res = await fetch("/api/subscriptions/me", {
      method: "DELETE",
    });

    if (res.ok) {
      dispatch(setMySubscription(null));
    } else {
      const error = await res.json();
      dispatch(setSubscriptionError(error));
    }
  } catch (error) {
    dispatch(setSubscriptionError({ message: "Network error" }));
  }
};

const initialState = {
  subscription: null,
  error: null,
};

function userSubscriptionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MY_SUBSCRIPTION:
      return {
        ...state,
        subscription: action.payload,
        error: null,
      };
    case SET_SUBSCRIPTION_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_SUBSCRIPTION_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export default userSubscriptionReducer;
