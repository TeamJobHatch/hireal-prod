// Action types
const SET_STRIPE_PUBLIC_KEY = 'payments/setStripePublicKey';
const SET_CHECKOUT_URL = 'payments/setCheckoutUrl';
const CLEAR_CHECKOUT_URL = 'payments/clearCheckoutUrl';

// Actions
const setStripePublicKey = (key) => ({
  type: SET_STRIPE_PUBLIC_KEY,
  payload: key,
});

const setCheckoutUrl = (url) => ({
  type: SET_CHECKOUT_URL,
  payload: url,
});

export const clearCheckoutUrl = () => ({
  type: CLEAR_CHECKOUT_URL,
});

// Thunks
export const thunkFetchStripeConfig = (planId) => async (dispatch) => {
  const res = await fetch(`/api/payments/config?plan_id=${planId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(setStripePublicKey(data.publicKey));
    return data.plan;
  }
};

export const thunkCreateCheckoutSession = (planId) => async (dispatch) => {
  const res = await fetch(`/api/payments/create-checkout-session/${planId}`, {
    method: 'POST',
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(setCheckoutUrl(data.url));
    return data.url;
  }
  // handle error as needed
};

// Reducer
const initialState = {
  publicKey: null,
  checkoutUrl: null,
};

export default function paymentsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STRIPE_PUBLIC_KEY:
      return { ...state, publicKey: action.payload };
    case SET_CHECKOUT_URL:
      return { ...state, checkoutUrl: action.payload };
    case CLEAR_CHECKOUT_URL:
      return { ...state, checkoutUrl: null };
    default:
      return state;
  }
}
