const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const q = (sql, params) => pool.query(sql, params);

// ── quotes ──
app.post('/api/quotes', async (req, res) => {
  try {
    const { quote_no, store_name, staff_name, items, subtotal, discount_amt, discount_label, total_amt } = req.body;
    await q(
      'INSERT INTO quotes (quote_no, store_name, staff_name, items, subtotal, discount_amt, discount_label, total_amt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [quote_no, store_name, staff_name, JSON.stringify(items), subtotal, discount_amt, discount_label, total_amt]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/quotes', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM quotes ORDER BY created_at DESC LIMIT 100');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/quotes/:id', async (req, res) => {
  try {
    await q('DELETE FROM quotes WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── error_reports ──
app.post('/api/error-reports', async (req, res) => {
  try {
    const { product_id, product_name, category, description, page_context } = req.body;
    await q(
      "INSERT INTO error_reports (product_id, product_name, category, description, page_context) VALUES ($1,$2,$3,$4,$5)",
      [product_id, product_name, category, description, page_context]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/error-reports/count', async (req, res) => {
  try {
    const { rows } = await q("SELECT COUNT(*)::int AS count FROM error_reports WHERE status='new'");
    res.json({ count: rows[0].count });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/error-reports', async (req, res) => {
  try {
    const status = req.query.status || 'new';
    const { rows } = await q('SELECT * FROM error_reports WHERE status=$1 ORDER BY created_at DESC', [status]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/error-reports/:id/resolve', async (req, res) => {
  try {
    await q("UPDATE error_reports SET status='resolved' WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/error-reports/:id', async (req, res) => {
  try {
    await q('DELETE FROM error_reports WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── se_learning_logs ──
app.get('/api/se-logs', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM se_learning_logs ORDER BY completed_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/se-logs', async (req, res) => {
  try {
    const { name, duration_seconds } = req.body;
    await q('INSERT INTO se_learning_logs (name, duration_seconds) VALUES ($1,$2)', [name, duration_seconds]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(80, () => console.log('SIDIZ Catalog running on :80'));
