# TreeView — Tree Planting & Survival Tracker
> **Every tree counts, Verified Live**  
> *"Planting is Day One. Survival is the Impact."*

---

## 🌲 Overview

**TreeView** is a mobile-first digital platform for **CSR organizations, NGOs, schools, colleges, resident communities, municipalities, corporates, and individual tree planters** to track the complete multi-year lifecycle of every planted tree.

Every planted tree receives:
* A permanent structured **Tree ID** and printable **QR Identity Tag**.
* A precise **GPS geofence** with sub-25m satellite tolerance verification.
* Periodic **camera verification check-ins** analyzed by an 8-stage computer vision AI pipeline.
* Anti-fraud protection with an **Arborist Human-in-the-Loop Review Queue**.
* Auditable **CSR ESG impact reports** (Methodology A vs B) and an anonymized **Public Transparency Portal**.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Git**

### Installation & Running Locally
```bash
# 1. Clone repository (or navigate to project folder)
cd "treewatch"

# 2. Install all dependencies
npm run install:all

# 3. Start both backend and frontend concurrently
npm run dev
```

* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`
* **Health Check**: `http://localhost:5000/api/health`

---

## 📦 Deploying via Git (Step-by-Step)

### Step 1: Initialize Git Repository Locally

Open your terminal or PowerShell in the root project folder:

```bash
# Initialize local git repo
git init

# Stage all project files (ignoring node_modules, build outputs, and caches)
git add .

# Create your initial commit
git commit -m "Initial commit: TreeWatch - Every Tree Counts"
```

### Step 2: Push to GitHub / GitLab / Bitbucket

1. Create a new repository on [GitHub](https://github.com/new) (e.g. named `treewatch`).
2. Link your local repo and push:

```bash
# Rename branch to main
git branch -M main

# Add your remote repository URL (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/treewatch.git

# Push to GitHub
git push -u origin main
```

---

## ☁️ Cloud Deployment Options

### Option A: Single-Service Fullstack Deployment (Recommended)
You can deploy the entire application (frontend + backend) as a **single web service** with zero CORS setup on **Render**, **Railway**, or **Fly.io**.

#### Deploying on Render:
1. Go to [Render.com](https://render.com) and click **New > Web Service**.
2. Connect your GitHub repository `treewatch`.
3. Configure the build and start commands:
   * **Environment**: `Node`
   * **Build Command**: `npm --prefix server install && npm --prefix client install && npm --prefix client run build`
   * **Start Command**: `npm --prefix server start`
4. Render will automatically build the client bundle and serve both the API and the React SPA on your custom Render URL!

#### Deploying on Railway:
1. Go to [Railway.app](https://railway.app) and click **New Project > Deploy from GitHub repo**.
2. Select your `treewatch` repository.
3. Railway will detect `package.json` and build automatically.

---

### Option B: Split Deployment (Vercel Frontend + Render Backend)

If you prefer deploying the frontend on **Vercel** and the backend on **Render**:

#### 1. Deploy Backend on Render:
* **Root Directory**: `server`
* **Build Command**: `npm install`
* **Start Command**: `npm start`
* Note your backend URL (e.g. `https://treewatch-api.onrender.com`).

#### 2. Deploy Frontend on Vercel:
1. Go to [Vercel.com](https://vercel.com) and import your `treewatch` repository.
2. Select the `client` directory (or use the pre-configured `vercel.json`).
3. Add an Environment Variable in the Vercel Dashboard:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://treewatch-api.onrender.com`
4. Click **Deploy**.

---

## 🔒 Multi-Tenant Data Privacy & Role-Based Access

TreeView provides enterprise multi-tenancy:
* **NGOs & Field Leads**: Autonomous control over assigned concessions, volunteer rosters, and batch uploads. Private CSR budgets and other entities' sensitive operational data are protected.
* **Corporate CSR**: Comprehensive ESG compliance dashboards, Survival Methodology A vs B toggle, and downloadable formal audit certificates.
* **School Campuses**: Youth green adoption programs with Class-level badge milestones and anonymized student rosters.
* **Private Planters**: Independent citizen and landowner tree tracking without institutional affiliation.
* **Public Transparency**: Open-access verified survival metrics and satellite geofencing with PII scrubbed.

---

## 📄 License
ISC License © TreeView — Every tree counts, Verified Live
