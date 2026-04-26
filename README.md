# Startup Education Platform

## Overview
Startup Education is a comprehensive full-stack educational platform that aggregates and provides information on Internships, Jobs, Government Exams, and Courses. It features an interactive, modern, and responsive UI built with React/Next.js and a robust Node.js/Express backend powered by MongoDB and Google Gemini AI. 

The platform continuously integrates job opportunities, exam datasets (UPSC, SSC, RRB, etc.), and scraping pipelines for aggregator sites (Testbook, Byjus), alongside SEO-optimized dynamic job/internship listings.

## Features
- **Job & Internship Portal**: Browse and search dynamically fetched internships and jobs using a Next.js slug-based architecture for maximum SEO crawlability.
- **Government Exams Directory**: A rich, updated dataset covering Indian government exams (UPSC, SSC, Defense, etc.) with detailed information on syllabus, selection processes, and fast-track insights.
- **AI Integration**: Powered by Google Generative AI (Gemini) for advanced education-related queries, summaries, and automated classification.
- **Automated Data Scraping**: Robust `puppeteer` and `cheerio` scrapers operating via `node-cron` to keep exam and job data fresh. 
- **Code Execution Environment**: In-browser coding support utilizing the `@monaco-editor/react` library.
- **Authentication**: Secure JWT-based backend operations and Google OAuth client/server integrations.
- **Interactive UI**: Engaging user experiences with Framer Motion 3D animations, responsive mobile design, and modern Vite/Next.js React flows.

## Tech Stack

### Frontend App Ecosystem
The platform utilizes two distinct frontends tailored for varying use cases:
- **`client` (Vite SPA)**: A classic single-page React app with fast HMR (`react`, `react-router-dom`, `framer-motion`).
- **`client-next` (Next.js)**: Optimized for Server-Side Rendering (SSR) and superior SEO schemas (`next`, `react`, `framer-motion`).

### Backend Service
- **`server` (Express.js)**: A RESTful API powering the platform with Node.js.
- **Database**: MongoDB enabled by Mongoose.
- **AI/LLM Support**: `@google/generative-ai` (Gemini API), plus Natural language utilities.
- **Security & Reliability**: `helmet`, `express-rate-limit`, `cors`, and `jsonwebtoken`.
- **Scraping Engine**: Headless browser automation via `puppeteer` & HTML parsing with `cheerio`.

## Project Structure
- **/client**: The Vite SPA implementation with rich components and local routing.
- **/client-next**: Next.js implementation tailored for dynamic and SEO-friendly `jobs`/`internships` paths.
- **/server**: Express API housing models, controllers, routes, scheduled cron tasks, and scraping pipelines.
- **/data**: Various enriched JSON datasets containing exam details, overview fields, and legacy migration scripts.
- **/docs**: In-repo documentation and workflow templates.
- **Root Migrations & Utils**: Ad-hoc scripts (`fix-migration.js`, `migrate.js`, `add-seo.js`, `line_counter.py`) used for database transitions and dataset enrichment.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB cluster or local instance (`MONGO_URI`)
- A Google Gemini API Key (`GEMINI_API_KEY`)
- Google OAuth Client ID & Secret (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)

### 1. Server Setup
```bash
cd server
npm install
```
Create a `.env` file within the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend API logic:
```bash
# Uses nodemon for auto-restarts
npm run dev
```

### 2. Vite Client Setup
```bash
cd client
npm install
```
Create a `.env.local` or `.env` file within the `/client` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run the SPA development server:
```bash
npm run dev
```

### 3. Next.js Client Setup (SEO Optimized)
```bash
cd client-next
npm install
```
Start the Next JS specific development environment:
```bash
npm run dev
```

## Deployment
This architecture supports split Vercel project deployment for robust scalability.
Refer to the complete and detailed guide at **[DEPLOYMENT.md](./DEPLOYMENT.md)** to correctly configure your backend URL, environment variables, and rewrite rules for both the frontend SPA and the backend endpoints.

## Automations & Scraping
The platform runs backend jobs using `node-cron` to routinely pull new details from partner/educational aggregators. Due to the rapid nature of aggregator UI changes, ensure your `target_urls` remain active and non-404ing to avoid failing scraping batches.  

## License
Provided as an open-source education project initiative. Use of logos and trademarks from test authorities or organizations corresponds to educational fair usage contexts.
