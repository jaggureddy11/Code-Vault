import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.js';
import youtubeRoutes from './routes/youtube.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Middleware
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser clients / same-origin requests
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS_NOT_ALLOWED'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '256kb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/youtube', youtubeRoutes);

// Unified Deployment: Serve frontend static files
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route for React Router
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API route not found' });
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Error handler (keep last)
app.use((err, req, res, _next) => {
  const status = err?.message === 'CORS_NOT_ALLOWED' ? 403 : 500;
  const safeMessage = status === 403 ? 'Origin not allowed' : 'Internal server error';
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled error:', err);
  }
  res.status(status).json({ error: safeMessage });
});

app.listen(PORT, () => {
  console.log(`🚀 CodeVault backend running on port ${PORT}`);
});
