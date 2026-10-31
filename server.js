// Express API to connect React app with MySQL database
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL Database successfully!');
    connection.release();
  }
});

app.get('/api/health', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      return res.status(503).json({
        status: 'database unavailable',
        error: err.code || err.message,
      });
    }
    connection.release();
    res.json({ status: 'ok' });
  });
});

// API Endpoint: Save/Register User
app.post('/api/users/register', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const mobile = typeof req.body?.mobile === 'string' ? req.body.mobile.trim() : '';

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (name.length > 100) {
    return res.status(400).json({ error: 'Name must be 100 characters or fewer' });
  }
  if (mobile.length > 20) {
    return res.status(400).json({ error: 'Mobile number must be 20 characters or fewer' });
  }

  const query = `
    INSERT INTO dw_users (full_name, mobile_number) 
    VALUES (?, ?)
  `;

  db.query(query, [name, mobile || null], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Failed to save user in database' });
    }

    res.status(201).json({
      message: 'User registered successfully!',
      userId: result.insertId
    });
  });
});

// API Endpoint: Update User Counts (Diyas & Crackers)
app.post('/api/users/update-counts', (req, res) => {
  const { userId, diyasLit, crackersBurst } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  if (!Number.isInteger(Number(userId))) {
    return res.status(400).json({ error: 'User ID must be an integer' });
  }
  if (!Number.isInteger(Number(diyasLit)) || !Number.isInteger(Number(crackersBurst))) {
    return res.status(400).json({ error: 'Counts must be integers' });
  }
  if (Number(diyasLit) < 0 || Number(crackersBurst) < 0) {
    return res.status(400).json({ error: 'Counts cannot be negative' });
  }

  const query = `
    UPDATE dw_users 
    SET diyas_lit = ?, crackers_burst = ? 
    WHERE id = ?
  `;

  db.query(query, [Number(diyasLit), Number(crackersBurst), Number(userId)], (err, result) => {
    if (err) {
      console.error('Error updating counts:', err);
      return res.status(500).json({ error: 'Failed to update counts' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Counts updated successfully!' });
  });
});

const startServer = async () => {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT || 5173);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`App and API running at http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start app server:', error);
  process.exit(1);
});