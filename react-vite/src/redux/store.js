import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import jobPositionsReducer from './jobPositions';
import resumesReducer from './resumes';
import aiResumeAnalysisReducer from "./aiResumeAnalysis";
import jobResumeScoreReducer from './aiJobResumeScore';

const rootReducer = combineReducers({
  session: sessionReducer,
  jobs: jobPositionsReducer,
  resumes: resumesReducer,
  aiResumeAnalysis: aiResumeAnalysisReducer,
  jobResumeScore: jobResumeScoreReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
