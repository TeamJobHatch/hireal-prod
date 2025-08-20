# Flask React Project

This is the starter for the Flask React project.

## Getting started

1. Clone this repository (only this branch).

2. Install dependencies.(pip freeze > requirements.txt)

   ```bash
   pipenv install -r requirements.txt
   ```

3. Create a __.env__ file based on the example with proper settings for your
   development environment.

4. Make sure the SQLite3 database connection URL is in the __.env__ file.

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention.**

6. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app:

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. The React frontend has no styling applied. Copy the __.css__ files from your
   Authenticate Me project into the corresponding locations in the
   __react-vite__ folder to give your project a unique look.

8. To run the React frontend in development, `cd` into the __react-vite__
   directory and run `npm i` to install dependencies. Next, run `npm run build`
   to create the `dist` folder. The starter has modified the `npm run build`
   command to include the `--watch` flag. This flag will rebuild the __dist__
   folder whenever you change your code, keeping the production version up to
   date.

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



Venv initialization: 

source /Users/test/.local/share/virtualenvs/hireal-prod-C1jeDCtG/bin/activate

---

## Quick start (TL;DR)

1. Clone the repo and create a new branch for your work (optional):

   ```bash
   git clone <YOUR_REPO_URL>
   cd hireal-prod
   git checkout -b Simon-Exp
   ```

2. Backend setup (Python + Flask):

   ```bash
   pipenv install -r requirements.txt
   pipenv shell
   # create your .env based on the template below
   flask db upgrade
   flask seed all
   flask run
   ```

3. Frontend setup (React + Vite):

   ```bash
   cd react-vite
   npm i
   npm run dev
   ```

4. Production bundle for Flask to serve:

   ```bash
   cd react-vite
   npm run build
   ```

---

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm 9+
- Pipenv
- SQLite (dev) or Postgres (prod)

---

## Local environment variables (.env)

Create a `.env` file in the project root. This file is already gitignored and will not be committed. Use this template as a starting point:

```dotenv
# Flask
FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=change_me_in_production

# Database (SQLite example)
DATABASE_URL=sqlite:///dev.db

# Optional: schema name used by this starter
SCHEMA=flask_schema
```

---

## Development workflow

- Backend
  - Enter the virtualenv: `pipenv shell`
  - Run migrations: `flask db upgrade`
  - Seed data (optional): `flask seed all`
  - Start server: `flask run`

- Frontend
  - Install deps: `cd react-vite && npm i`
  - Dev server: `npm run dev`
  - Build assets into `react-vite/dist`: `npm run build`

---

## Branching and pushing to GitHub

To push your work to the `Simon-Exp` branch on origin:

```bash
git checkout -b Simon-Exp  # if not already on the branch
git add -A                  # .env is excluded by .gitignore
git commit -m "chore: setup docs and project push to Simon-Exp"
git push -u origin Simon-Exp
```

---

## Notes

- The `.env` file and local environment-specific folders are excluded via `.gitignore` (e.g., `instance/`).
- For production, ensure you follow the Render.com section above and mirror any required environment variables in the Render dashboard.
