const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/chuck  — proxy Anthropic API so the key never touches the browser
router.post('/', requireAuth, async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service not configured on server' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data.error?.message || `Anthropic error ${upstream.status}`,
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Chuck proxy error:', err);
    res.status(500).json({ error: 'Failed to reach AI service' });
  }
});

module.exports = router;
