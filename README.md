<div align="center">
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=react&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Sanity-black?style=for-the-badge&logoColor=white&logo=sanity&color=F03E2F" alt="sanity" />
    <img src="https://img.shields.io/badge/-Python-black?style=for-the-badge&logoColor=white&logo=python&color=3776AB" alt="python" />
    <img src="https://img.shields.io/badge/-FastAPI-black?style=for-the-badge&logoColor=white&logo=fastapi&color=009688" alt="fastapi" />
  </div>

  <h3 align="center">Pitch Park - The LinkedIn for Startups</h3>
</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🚀 [Roadmap & Future Features](#roadmap--future-features)

## <a name="introduction">🤖 Introduction</a>

**Pitch Park** is a premium discovery platform where entrepreneurs can submit their startup ideas for virtual pitch competitions, browse other pitches, and gain exposure through a sleek, minimalistic design (featuring a professional SaaS aesthetic with zinc and indigo styling) for a smooth user experience. It acts as a direct bridge, connecting startup founders with potential investors and enthusiasts.

Additionally, Pitch Park features an intelligent **Startup Score Predictor** powered by a Machine Learning backend that evaluates a startup's metrics (like Annual Revenue, Funding Raised, Team Size, Location, etc.) to generate a predicted success score, helping investors discover high-potential companies.

## <a name="tech-stack">⚙️ Tech Stack</a>

### Frontend
- **Framework**: Next.js 15, React 19
- **Styling**: TailwindCSS, ShadCN
- **CMS / Database**: Sanity
- **Language**: TypeScript

### Backend (Predictive ML API)
- **Server**: FastAPI, Uvicorn
- **Machine Learning Environment**: Python 3
- **ML Libraries**: `pandas`, `scikit-learn`, `numpy`, `joblib`, `xgboost`

## <a name="features">🔋 Features</a>

👉 **Startup Score Predictor (ML)**: Uses a backend machine learning model to analyze a startup's financials and team size, providing an accurate evaluation score dynamically.

👉 **Live Content API**: Displays the latest startup ideas dynamically on the homepage using Sanity's Content API.

👉 **GitHub Authentication**: Allows users to log in easily using their GitHub account.

👉 **Pitch Submission**: Users can submit startup ideas, including title, description, category, and multimedia links (image or video).

👉 **View Pitches**: Browse through submitted ideas with filtering options by category.

👉 **Profile Page**: Users can view the list of pitches they've submitted.

👉 **Editor Picks**: Admins can highlight top startup ideas using the "Editor Picks" feature managed via Sanity Studio.

👉 **Views Counter**: Tracks the number of views for each pitch.

👉 **Professional Minimalistic Design**: Fresh and simple UI with only the essential pages for ease of use and a clean aesthetic.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en) and npm
- [Python 3.8+](https://www.python.org/downloads/)
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

To ensure the "Get Startup Score" predictive feature works, you need to start the backend FastAPI server and install the necessary Python dependencies.

**Navigate to the Backend Directory:**
```bash
cd backend
```

**Install Python Dependencies:**
Ensure you have `pip` installed, then run:
```bash
pip install pandas numpy scikit-learn xgboost fastapi uvicorn pydantic joblib
```
*(Note: If you are using a virtual environment or `pip3`, adjust the command accordingly).*

**Run the Backend Server:**
```bash
python -m uvicorn app:app --port 5000
```
The backend API will start on [http://localhost:5000](http://localhost:5000). The frontend will securely communicate with this server on the `/predict` endpoint to generate startup scores.

## <a name="roadmap--future-features">🚀 Roadmap & Future Features</a>

To further establish Pitch Park as the ultimate "LinkedIn for Startups" and improve the networking capabilities between founders and investors, the following features are planned for future implementation:

1. **Direct Messaging / Chat System**
   - Implement real-time messaging so interested investors can directly reach out to startup founders without leaving the platform.

2. **Investor Dashboards & Bookmarks**
   - Provide a specialized dashboard for verified investors to bookmark pitches, track startups they've engaged with, and sort their feed entirely by ML "Startup Scores".

3. **Interactive Q&A and Comments**
   - Add a comment thread to every pitch page, allowing investors to publicly ask clarifying questions and founders to respond, providing transparency to the community.

4. **Pitch Deck Viewer**
   - Allow founders to upload PDF pitch decks and render them inline using a clean document viewer directly on the platform.

5. **Social Endorsements / Upvoting**
   - Upgrade the standard "views" counter to a verified "Upvote" or "Endorsement" system, helping the best startup ideas naturally bubble to the top of the feed.
