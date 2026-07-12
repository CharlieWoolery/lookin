const express = require('express');
const { requireAuth } = require('../middleware/auth');
const db = require('../database');

const router = express.Router();

// GET /api/saved  — list saved stores for the logged-in user
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM saved_stores WHERE user_id = ? ORDER BY saved_at DESC'
  ).all(req.user.userId);
  res.json(rows);
});

// POST /api/saved  — save a store
router.post('/', requireAuth, (req, res) => {
  const { store_id, store_name, item_name, price, category, gradient, price_range, distance, lat, lng } = req.body || {};

  if (!store_name || !item_name) {
    return res.status(400).json({ error: 'store_name and item_name are required' });
  }

  // Idempotent: return existing row if already saved
  const existing = db.prepare(
    'SELECT id FROM saved_stores WHERE user_id = ? AND store_name = ? AND item_name = ?'
  ).get(req.user.userId, store_name, item_name);

  if (existing) {
    return res.json({ id: existing.id, already_saved: true });
  }

  const result = db.prepare(`
    INSERT INTO saved_stores
      (user_id, store_id, store_name, item_name, price, category, gradient, price_range, distance, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.user.userId,
    store_id   ?? null,
    store_name,
    item_name,
    price      ?? null,
    category   ?? null,
    gradient   ?? null,
    price_range ?? null,
    distance   ?? null,
    lat        ?? null,
    lng        ?? null
  );

  res.status(201).json({ id: Number(result.lastInsertRowid) });
});

// DELETE /api/saved/:id  — remove a saved store
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare(
    'DELETE FROM saved_stores WHERE id = ? AND user_id = ?'
  ).run(req.params.id, req.user.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Saved store not found' });
  }
  res.json({ success: true });
});

module.exports = router;
