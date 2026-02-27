# Vercel Deployment Guide

This guide covers deploying the Startup Education platform to Vercel using separate deployments for frontend and backend.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm install -g vercel`
3. **Environment Variables**: Prepare all required environment variables

## Deployment Strategy

This project uses **separate deployments**:

- **Frontend (Client)**: Deployed as a static Vite React app
- **Backend (Server)**: Deployed as Vercel Serverless Functions

## Part 1: Deploy Backend API

### Step 1: Deploy Server to Vercel

#### Option A: Using Vercel Dashboard (Recommended for First Deployment)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. **Configure Project**:
   - **Root Directory**: Select `server`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (not needed)
   - **Output Directory**: Leave empty
4. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
cd server
vercel --prod
```

### Step 2: Configure Backend Environment Variables

Go to your backend project in Vercel Dashboard → Settings → Environment Variables

Add the following variables (from `server/.env`):

**Required:**

- `JWT_SECRET` - Your JWT secret key (CRITICAL - server will crash without this)
- `MONGO_URI` - MongoDB connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GEMINI_API_KEY` - Google Gemini AI API key

**Optional:**

- `PORT` - Will be set automatically by Vercel
- `NODE_ENV` - Automatically set to "production"

### Step 3: Note Your Backend URL

After deployment, you'll get a URL like:

```
https://startup-education-api.vercel.app
```

**Save this URL** - you'll need it for the frontend configuration.

---

## Part 2: Deploy Frontend App

### Step 1: Update Frontend API URL

Edit `client/.env` or `client/.env.production`:

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

Replace `your-backend-url.vercel.app` with your actual backend URL from Part 1, Step 3.

### Step 2: Deploy Client to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (or create a new project)
3. **Configure Project**:
   - **Root Directory**: Leave as root (or select `client` if deploying from subdirectory)
   - **Framework Preset**: Vite
   - **Build Command**: `cd client && npm install && npm run build` (if root) or `npm run build` (if client directory)
   - **Output Directory**: `client/dist` (if root) or `dist` (if client directory)
4. Click **Deploy**

#### Option B: Using Vercel CLI (from root directory)

```bash
vercel --prod
```

The `vercel.json` in the root will automatically configure the build.

### Step 3: Configure Frontend Environment Variables

Go to your frontend project in Vercel Dashboard → Settings → Environment Variables

Add:

- `VITE_API_URL` - Your backend URL from Part 1
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID (for frontend)
- Any other `VITE_*` variables from `client/.env`

### Step 4: Redeploy if Needed

If you added environment variables after first deployment:

- Go to Deployments tab
- Click the three dots on the latest deployment
- Select "Redeploy"

---

## Post-Deployment Verification

### Backend Verification

1. Visit your backend URL: `https://your-backend-url.vercel.app/`
2. You should see: "Startup Education API is running"
3. Test an API endpoint: `https://your-backend-url.vercel.app/api/internships`

### Frontend Verification

1. Visit your frontend URL: `https://your-frontend-url.vercel.app/`
2. The homepage should load without 404 errors
3. Navigate to different pages (Internships, Jobs, Courses, etc.)
4. Check browser console (F12) for errors
5. Test functionality:
   - Search features
   - Login/authentication
   - Fetching data from API

### Common Issues & Solutions

#### Issue: 404 on All Routes

**Solution**: Check that `vercel.json` has proper rewrites for SPA routing

#### Issue: API Calls Fail

**Solution**:

- Verify `VITE_API_URL` is set correctly in frontend
- Check CORS settings in backend
- Verify backend environment variables are set

#### Issue: "JWT_SECRET is not set" Error

**Solution**: Add `JWT_SECRET` to backend environment variables in Vercel

#### Issue: MongoDB Connection Error

**Solution**:

- Verify `MONGO_URI` is set correctly
- Ensure MongoDB Atlas (or your MongoDB host) allows connections from Vercel IPs
- Check MongoDB Atlas Network Access settings

#### Issue: Google OAuth Not Working

**Solution**:

- Add Vercel URLs to Google Cloud Console authorized redirect URIs
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

---

## Updating Your Deployment

### For Code Changes

Push to your Git repository - Vercel will auto-deploy if you connected via Git.

Or redeploy manually:

```bash
vercel --prod
```

### For Environment Variable Changes

1. Update variables in Vercel Dashboard
2. Trigger a redeploy (doesn't require code changes)

---

## Alternative: Single Repository Deployment

If you prefer to deploy both from a single Vercel project:

1. Modify root `vercel.json` to include API routes
2. Point `/api/*` to serverless functions
3. See Vercel documentation on monorepo deployments

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)

---

## Quick Reference

**Backend URL**: `https://your-backend-url.vercel.app`  
**Frontend URL**: `https://your-frontend-url.vercel.app`

**Backend Environment Variables**: JWT_SECRET, MONGO_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GEMINI_API_KEY

**Frontend Environment Variables**: VITE_API_URL, VITE_GOOGLE_CLIENT_ID
