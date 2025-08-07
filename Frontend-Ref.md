# HiReal Frontend Reference

This document contains comprehensive information about the HiReal application's frontend structure and deployment.


## Frontend Pages Reference

### 📋 Complete Frontend Pages List

#### 🏠 Core Pages
1. **Home/Welcome Page** 
   - Route: `/`
   - Component: Inline `<h1>` (needs proper HomePage component)
   - File: Should use `HomePage/HomePage.jsx`

#### 🔐 Authentication Pages
2. **Login Page**
   - Route: `/login`
   - Component: `LoginFormPage`
   - File: `LoginFormPage/LoginFormPage.jsx`
   - Additional: `GoogleLoginButton.jsx`

3. **Signup Page**
   - Route: `/signup`
   - Component: `SignupFormPage`
   - File: `SignupFormPage/SignupFormPage.jsx`

#### 💼 Job Management Pages
4. **Job Positions List**
   - Route: `/joblist`
   - Component: `ShowJobPositions`
   - File: `ManageJobPosition/ShowJobPositions.jsx`

5. **New Job Position**
   - Route: `/joblist/new`
   - Component: `NewJobPosition`
   - File: `ManageJobPosition/NewJobPosition.jsx`

6. **Edit Job Position**
   - Route: `/joblist/edit/:id`
   - Component: `EditJobPosition`
   - File: `ManageJobPosition/EditJobPosition.jsx`

7. **Job Position Detail**
   - Route: `/joblist/:id`
   - Component: `JobPositionDetail`
   - File: `ManageJobPosition/JobPositionDetail.jsx`

#### 📄 Resume Management Pages
8. **Manage Resumes**
   - Route: `/resumes`
   - Component: `ManageResumes`
   - File: `ManageResume/ManageResumes.jsx`

9. **New Resume**
   - Route: `/resumes/new`
   - Component: `NewResumePage`
   - File: `ManageResume/NewResumePage.jsx`

10. **Edit Resume**
    - Route: `/resumes/:resumeId/edit`
    - Component: `EditResumePage`
    - File: `ManageResume/EditResumePage.jsx`

#### 🤖 AI Analysis Pages
11. **Resume AI Analysis**
    - Route: `/resumes/:resumeId/ai-score`
    - Component: `ResumeAIAnalysis`
    - File: `ResumeAIAnalysis/ResumeAIAnalysis.jsx`

#### 🎯 Resume-Job Matching Pages
12. **Resume Job Match (Single)**
    - Route: `/jobs/:jobId/resumes/:resumeId/match`
    - Component: `ResumeJobMatch`
    - File: `ResumeJobMatch/ResumeJobMatch.jsx`

13. **Select Resume to Match**
    - Route: `/jobs/:jobId/resumes/select`
    - Component: `SelectResumeToMatch`
    - File: `ResumeJobMatch/SelectResumeToMatch.jsx`

14. **Batch Select Resumes**
    - Route: `/jobs/:jobId/select_resumes_batch`
    - Component: `BatchSelectResumesToMatch`
    - File: `ResumeJobMatch/BatchSelectResumesToMatch.jsx`

15. **Batch Resume Job Match Results**
    - Route: `/jobs/:jobId/resumes/match_batch_results`
    - Component: `BatchResumeJobMatch`
    - File: `ResumeJobMatch/BatchResumeJobMatch.jsx`

#### 💳 Subscription/Payment Pages
16. **Plans List**
    - Route: `/plans`
    - Component: `PlanListPage`
    - File: `ManageSubPlan/PlanListPage.jsx`

17. **Plan Detail**
    - Route: `/plans/:planId`
    - Component: `PlanDetailPage`
    - File: `ManageSubPlan/PlanDetailPage.jsx`

#### 🧩 Shared Components (Not Routes)
- **Navigation** - `Navigation/Navigation.jsx`
- **Profile Button** - `Navigation/ProfileButton.jsx`
- **Login Modal** - `LoginFormModal/LoginFormModal.jsx`
- **Signup Modal** - `SignupFormModal/SignupFormModal.jsx`
- **Open Modal Button** - `OpenModalButton/OpenModalButton.jsx`

### 🎨 CSS/Design Priority Order

#### High Priority (Core User Flow)
1. Home/Welcome Page
2. Login Page
3. Signup Page
4. Navigation Component

#### Medium Priority (Main Features)
5. Job Positions List
6. Manage Resumes
7. Resume AI Analysis
8. Resume Job Match

#### Lower Priority (Secondary Features)
9. New/Edit Job Position
10. New/Edit Resume
11. Batch matching pages
12. Subscription pages

### 🔧 Technical Notes
- Uses **Tailwind CSS** framework
- Current pages have some basic CSS (LoginForm.css, SignupForm.css)
- Navigation component appears on all pages
- Modal components need consistent styling
- Consider mobile responsiveness for all pages
- **Total: 17 main pages** plus shared components

## Deployment through Render.com

First, recall that Vite is a development dependency, so it will not be used in
production. This means that you must already have the __dist__ folder located in
the root of your __react-vite__ folder when you push to GitHub. This __dist__
folder contains your React code and all necessary dependencies minified and
bundled into a smaller footprint, ready to be served from your Python API.

Begin deployment by running `npm run build` in your __react-vite__ folder and
pushing any changes to GitHub.

Refer to your Render.com deployment articles for more detailed instructions
about getting started with [Render.com], creating a production database, and
deployment debugging tips.

From the Render [Dashboard], click on the "New +" button in the navigation bar,
and click on "Web Service" to create the application that will be deployed.

Select that you want to "Build and deploy from a Git repository" and click
"Next". On the next page, find the name of the application repo you want to
deploy and click the "Connect" button to the right of the name.

Now you need to fill out the form to configure your app. Most of the setup will
be handled by the __Dockerfile__, but you do need to fill in a few fields.

Start by giving your application a name.

Make sure the Region is set to the location closest to you, the Branch is set to
"main", and Runtime is set to "Docker". You can leave the Root Directory field
blank. (By default, Render will run commands from the root directory.)

Select "Free" as your Instance Type.

### Add environment variables

In the development environment, you have been securing your environment
variables in a __.env__ file, which has been removed from source control (i.e.,
the file is gitignored). In this step, you will need to input the keys and
values for the environment variables you need for production into the Render
GUI.

Add the following keys and values in the Render GUI form:

- SECRET_KEY (click "Generate" to generate a secure secret for production)
- FLASK_ENV production
- FLASK_APP app
- SCHEMA (your unique schema name, in snake_case)

In a new tab, navigate to your dashboard and click on your Postgres database
instance.

Add the following keys and values:

- DATABASE_URL (copy value from the **External Database URL** field)

**Note:** Add any other keys and values that may be present in your local
__.env__ file. As you work to further develop your project, you may need to add
more environment variables to your local __.env__ file. Make sure you add these
environment variables to the Render GUI as well for the next deployment.

### Deploy

Now you are finally ready to deploy! Click "Create Web Service" to deploy your
project. The deployment process will likely take about 10-15 minutes if
everything works as expected. You can monitor the logs to see your Dockerfile
commands being executed and any errors that occur.

When deployment is complete, open your deployed site and check to see that you
have successfully deployed your Flask application to Render! You can find the
URL for your site just below the name of the Web Service at the top of the page.

**Note:** By default, Render will set Auto-Deploy for your project to true. This
setting will cause Render to re-deploy your application every time you push to
main, always keeping it up to date.

[Render.com]: https://render.com/
[Dashboard]: https://dashboard.render.com/
