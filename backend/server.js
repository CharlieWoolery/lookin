require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes  = require('./routes/auth');
const savedRoutes = require('./routes/saved');
const chuckRoutes = require('./routes/chuck');

const app = express();

// Allow requests from the GitHub Pages frontend (and localhost during dev)
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      process.env.CORS_ORIGIN,
      'http://localhost:8080',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
    ].filter(Boolean);
    // Allow requests with no origin (e.g. curl, Postman)
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', app: 'Lookin API' }));

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/chuck', chuckRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Lookin API running on port ${PORT}`);
});
