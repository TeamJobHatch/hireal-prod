import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
}

const GOOGLE_CLIENT_ID = "699014421000-8csif2sipgrk8g7cviqo3tmjfmchge74.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode>
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </GoogleOAuthProvider>
</React.StrictMode>
);
