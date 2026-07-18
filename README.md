<div align="center">
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=react&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Sanity-black?style=for-the-badge&logoColor=white&logo=sanity&color=F03E2F" alt="sanity" />
    <img src="https://img.shields.io/badge/-Node.js-black?style=for-the-badge&logoColor=white&logo=node.js&color=339933" alt="nodejs" />
    <img src="https://img.shields.io/badge/-Python-black?style=for-the-badge&logoColor=white&logo=python&color=3776AB" alt="python" />
  </div>

  <h3 align="center">Pitch Park - The LinkedIn for Startups</h3>
</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🚀 [Recommended Improvements](#recommended-improvements)

## <a name="introduction">🤖 Introduction</a>

**Pitch Park** is a platform where entrepreneurs can submit their startup ideas for virtual pitch competitions, browse other pitches, and gain exposure through a clean, minimalistic design for a smooth user experience. It acts like a "LinkedIn for Startups", connecting ideas with potential investors and enthusiasts.

Additionally, Pitch Park features an intelligent **Startup Score Predictor** powered by a Machine Learning backend that evaluates a startup's metrics (like Annual Revenue, Funding Raised, Team Size, Location, etc.) to generate a predicted success score.

## <a name="tech-stack">⚙️ Tech Stack</a>

### Frontend
- **Framework**: Next.js 15, React 19
- **Styling**: TailwindCSS, ShadCN
- **CMS / Database**: Sanity
- **Language**: TypeScript

### Backend (Predictive ML API)
- **Server**: Node.js, Express
- **Machine Learning Environment**: Python 3
- **ML Libraries**: `pandas`, `scikit-learn`, `numpy`, `joblib`, `xgboost`
- **Integration**: `python-shell` to connect Node.js with Python

## <a name="features">🔋 Features</a>

👉 **Startup Score Predictor (ML)**: Uses a backend machine learning model (`xgb_model.joblib`) to analyze a startup's financials and team size, providing an accurate evaluation score dynamically.

👉 **Live Content API**: Displays the latest startup ideas dynamically on the homepage using Sanity's Content API.

👉 **GitHub Authentication**: Allows users to log in easily using their GitHub account.

👉 **Pitch Submission**: Users can submit startup ideas, including title, description, category, and multimedia links (image or video).

👉 **View Pitches**: Browse through submitted ideas with filtering options by category.

👉 **Profile Page**: Users can view the list of pitches they've submitted.

👉 **Editor Picks**: Admins can highlight top startup ideas using the "Editor Picks" feature managed via Sanity Studio.

👉 **Views Counter**: Tracks the number of views for each pitch.

👉 **Minimalistic Design**: Fresh and simple UI with only the essential pages for ease of use and a clean aesthetic.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en) and npm
- [Python 3.x](https://www.python.org/downloads/)
- [Git](https://git-scm.com/)

### 1. Frontend Setup

**Install Dependencies:**
```bash
npm install
```

**Set Up Environment Variables:**
Create a new file named `.env.local` in the root of your project and add the following content (replace placeholders with your actual Sanity and GitHub OAuth credentials):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION='vX'
SANITY_TOKEN=

AUTH_SECRET= 
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

**Run the Frontend:**
```bash
npm run dev
```
The frontend will be available at [http://localhost:3000](http://localhost:3000).

### 2. Backend Setup (Startup Score Feature)

To ensure the "Get Startup Score" predictive feature works, you need to start the backend Express server and install the necessary Python dependencies.

**Navigate to the Backend Directory:**
```bash
cd backend
```

**Install Node Dependencies:**
```bash
npm install
```

**Install Python Dependencies:**
Ensure you have `pip` installed, then run:
```bash
pip install pandas numpy scikit-learn joblib xgboost
```
*(Note: If you are using a virtual environment or `pip3`, adjust the command accordingly).*

**Run the Backend Server:**
```bash
node index.js
```
The backend API will start on [http://localhost:5000](http://localhost:5000). The frontend will communicate with this server on the `/predict` endpoint to generate startup scores.

## <a name="recommended-improvements">🚀 Recommended Improvements</a>

Here are some potential enhancements that could drastically improve the functionality, performance, and user experience of Pitch Park:

1. **Optimize Backend Architecture (High Priority)**
   - **Current State**: The Node.js server uses `python-shell` to spin up a new Python process on *every single request*. The `predict.py` script loads the ML model (`xgb_model.joblib`) and the entire dataset (`AngelList_Startups.csv`) from the disk on every execution.
   - **Improvement**: Rewrite the backend using **FastAPI** or **Flask** (Python). This allows the ML model and dataset to be loaded into memory just *once* when the server starts, making the prediction API lightning-fast (milliseconds instead of seconds) and preventing the server from timing out under load.

2. **Advanced Engagement & Networking**
   - Enhance the "LinkedIn for Startups" vibe by adding an **Upvote / Like system** (currently it's just views) and a **Comments Section** on each pitch to allow investors and users to ask questions or give feedback.

3. **Enhanced Filtering & Search**
   - Add the ability to filter and sort startups by their generated **Startup Score**, location, or funding stage, allowing investors to discover high-potential startups more easily.

4. **Robust Error Handling for Predictions**
   - Add better loading states, skeletons, and error boundaries on the frontend specifically for the "Get Startup Score" component, as the Python script has a 15-second timeout and might fail if Python dependencies are missing.

5. **Data Caching & Pagination**
   - Implement Next.js data caching (or React Query) and pagination for the startup feed to ensure the platform scales gracefully as more pitches are added.
