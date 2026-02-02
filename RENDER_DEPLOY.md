# Deploy Frontend & Backend on Render

Push your code to GitHub first, then follow these steps for each service.

---

## 1. Deploy BACKEND (Node/Express)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**.
2. Connect your GitHub repo (the one containing `backend` and `frontend` folders).
3. Configure:
   - **Name:** `shop-swift-api` (or any name)
   - **Region:** Choose nearest to you
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment Variables** (Add each one):
   | Key | Value |
   |-----|--------|
   | `PORT` | `5000` |
   | `DB_HOST` | Your Railway MySQL host (e.g. `turntable.proxy.rlwy.net`) |
   | `DB_USER` | Railway MySQL user |
   | `DB_PASSWORD` | Railway MySQL password |
   | `DB_NAME` | Railway database name (e.g. `railway`) |
   | `DB_PORT` | Railway MySQL port (e.g. `57903`) |
   | `JWT_SECRET` | A long random string (e.g. generate one) |
   | `CORS_ORIGIN` | Your frontend URL (set in step 2 below, e.g. `https://your-frontend.onrender.com`) |
   | `FRONTEND_URL` | Same as CORS_ORIGIN |
   | `API_BASE_URL` | Your backend URL (e.g. `https://shop-swift-api.onrender.com`) |
5. Click **Create Web Service**. Wait for deploy. Copy the service URL (e.g. `https://shop-swift-api.onrender.com`). You will use this as the API URL for the frontend.

---

## 2. Deploy FRONTEND (Vite/React)

1. **New** → **Static Site** (or **Web Service** if you prefer).
2. Connect the same GitHub repo.
3. Configure:
   - **Name:** `shop-swift-frontend` (or any name)
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. **Environment Variables** (Add **before** first deploy so they are baked into the build):
   | Key | Value |
   |-----|--------|
   | `VITE_API_BASE_URL` | Your **backend** URL from step 1 (e.g. `https://shop-swift-api.onrender.com`) |
   | `VITE_API_SERVER_URL` | Same as VITE_API_BASE_URL (used for image URLs) |
5. Click **Create Static Site**. Wait for deploy. Copy the frontend URL (e.g. `https://shop-swift-frontend.onrender.com`).

---

## 3. Update CORS on Backend

1. Go back to your **Backend** service on Render → **Environment**.
2. Set `CORS_ORIGIN` and `FRONTEND_URL` to your **frontend** URL (e.g. `https://shop-swift-frontend.onrender.com`).
3. Save. Render will redeploy the backend so it allows requests from the frontend.

---

## 4. Summary

- **Backend URL** → Use in frontend as `VITE_API_BASE_URL` and in backend as `API_BASE_URL`.
- **Frontend URL** → Use in backend as `CORS_ORIGIN` and `FRONTEND_URL`.
- After any change to env vars, redeploy if needed (Render often auto-redeploys on save).

---

## Quick reference

| Service  | Root Directory | Build Command              | Start / Publish      |
|----------|----------------|----------------------------|----------------------|
| Backend  | `backend`      | `npm install`              | Start: `npm start`   |
| Frontend | `frontend`    | `npm install && npm run build` | Publish: `dist` |
