// 没有实际使用 也没有注册



// action types
const CREATE_CHECKOUT_SESSION_REQUEST = 'payment/createCheckoutSessionRequest';
const CREATE_CHECKOUT_SESSION_SUCCESS = 'payment/createCheckoutSessionSuccess';
const CREATE_CHECKOUT_SESSION_FAILURE = 'payment/createCheckoutSessionFailure';

// action creators
const createCheckoutSessionRequest = () => ({ type: CREATE_CHECKOUT_SESSION_REQUEST });
const createCheckoutSessionSuccess = (url) => ({
  type: CREATE_CHECKOUT_SESSION_SUCCESS,
  payload: url,
});
const createCheckoutSessionFailure = (error) => ({
  type: CREATE_CHECKOUT_SESSION_FAILURE,
  payload: error,
});

// thunk for creating checkout session
export const thunkCreateCheckoutSession = (planId) => async (dispatch) => {
  dispatch(createCheckoutSessionRequest());
  try {
    const res = await fetch(`/api/stripe/create-checkout-session/${planId}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }
    const data = await res.json();
    dispatch(createCheckoutSessionSuccess(data.url));
    // Redirect to Stripe checkout page
    window.location.href = data.url;
  } catch (error) {
    dispatch(createCheckoutSessionFailure(error.message));
  }
};
