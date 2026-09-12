import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authRouter } from './routes/auth.js';
import { organisationsRouter } from './routes/organisations.js';
import { projectsRouter } from './routes/projects.js';
import { treesRouter } from './routes/trees.js';
import { verifyRouter } from './routes/verify.js';
import { reviewsRouter } from './routes/reviews.js';
import { analyticsRouter } from './routes/analytics.js';
import { reportsRouter } from './routes/reports.js';
import { publicRouter } from './routes/public.js';
import { notificationsRouter } from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vite frontend
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/organisations', organisationsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/trees', treesRouter);
app.use('/api/verify', verifyRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/public', publicRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TreeWatch Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend build if dist folder exists (Single-service cloud deployment)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🌲 TreeWatch Backend API listening on http://localhost:${PORT}`);
  console.log(`🌱 Tagline: Every Tree Counts. Keep It Alive.`);
});
