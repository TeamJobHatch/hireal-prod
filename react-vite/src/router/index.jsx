import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../components/HomePage/HomePage';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ShowJobPositions from '../components/ManageJobPosition/ShowJobPositions';
import JobPositionDetail from '../components/ManageJobPosition/JobPositionDetail';
import EditJobPosition from '../components/ManageJobPosition/EditJobPosition'
import NewJobPosition from '../components/ManageJobPosition/NewJobPosition'
import ManageResumes from "../components/ManageResume/ManageResumes";
import NewResumePage from "../components/ManageResume/NewResumePage";
import EditResumePage from "../components/ManageResume/EditResumePage";
import ResumeAIAnalysis from '../components/ResumeAIAnalysis/ResumeAIAnalysis';
import ResumeJobMatch from '../components/ResumeJobMatch/ResumeJobMatch'
import SelectResumeToMatch from "../components/ResumeJobMatch/SelectResumeToMatch";
import BatchSelectResumesToMatch from '../components/ResumeJobMatch/BatchSelectResumesToMatch'
import BatchResumeJobMatch from '../components/ResumeJobMatch/BatchResumeJobMatch'
import PlanListPage from '../components/ManageSubPlan/PlanListPage';
import PlanDetailPage from '../components/ManageSubPlan/PlanDetailPage';


import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "joblist",
        element: <ShowJobPositions />,
      },
      {
        path: "joblist/new",
        element: <NewJobPosition />,
      },
      {
        path: "joblist/edit/:id",
        element: <EditJobPosition />,
      },
      {
        path: "joblist/:id",
        element: <JobPositionDetail />,
      },
      {
        path: "resumes",
        element: <ManageResumes />,
      },
      {
        path: "resumes/new",
        element: <NewResumePage />,
      },
      {
        path: "/resumes/:resumeId/edit",
        element: <EditResumePage />,
      },
      {
        path: "/resumes/:resumeId/ai-score",
        element: <ResumeAIAnalysis />,
      },
      {
        path: "/jobs/:jobId/resumes/:resumeId/match",
        element: <ResumeJobMatch />,
      },
      {
        path: "/jobs/:jobId/resumes/select",
        element: <SelectResumeToMatch />,
      },
      {
        path: "/jobs/:jobId/select_resumes_batch",
        element: <BatchSelectResumesToMatch />,
      },
      {
        path: "/jobs/:jobId/resumes/match_batch_results",
        element: <BatchResumeJobMatch />,
      },
      {
        path: "plans",
        element: <PlanListPage />,
      },
      {
        path: "plans/:planId",
        element: <PlanDetailPage />,
      },

    ],
  },
]);