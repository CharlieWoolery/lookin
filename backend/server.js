require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes  = require('./routes/auth');
const savedRoutes = require('./routes/saved');
const chuckRoutes = require('./routes/chuck');

const app = express();

const ALLOWED_ORIGINS = [
  'https://charliewoolery.github.io',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8080',
  process.env.CORS_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Explicit preflight handler — must come before all routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', app: 'Lookin API' }));

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/chuck', chuckRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler — re-apply CORS header so browser errors are readable
app.use((err, req, res, _next) => {
  console.error(err);
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Lookin API running on port ${PORT}`);
});
