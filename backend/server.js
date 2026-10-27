const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL Database.');
});

// Utility to generate a simple ID
const genId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

// --- BOOKS ROUTES ---
app.get('/api/books', (req, res) => {
  db.query('SELECT * FROM books ORDER BY title', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/books', (req, res) => {
  const { title, author, genre, isbn, quantity } = req.body;
  const id = genId();
  const sql = 'INSERT INTO books (id, title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [id, title, author, genre, isbn, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, title, author, genre, isbn, quantity });
  });
});

app.put('/api/books/:id', (req, res) => {
  const { title, author, genre, isbn, quantity } = req.body;
  const sql = 'UPDATE books SET title=?, author=?, genre=?, isbn=?, quantity=? WHERE id=?';
  db.query(sql, [title, author, genre, isbn, quantity, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

app.delete('/api/books/:id', (req, res) => {
  db.query('DELETE FROM books WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- USERS ROUTES ---
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/users', (req, res) => {
  const { name, membershipId, password, role } = req.body;
  const id = genId();
  const sql = 'INSERT INTO users (id, name, membershipId, password, role) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [id, name, membershipId, password, role], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, name, membershipId, password, role });
  });
});

app.put('/api/users/:id', (req, res) => {
  const { name, membershipId, password, role } = req.body;
  const sql = 'UPDATE users SET name=?, membershipId=?, password=?, role=? WHERE id=?';
  db.query(sql, [name, membershipId, password, role, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

app.delete('/api/users/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- TRANSACTIONS ROUTES ---
app.get('/api/transactions', (req, res) => {
  db.query('SELECT * FROM transactions ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/transactions', (req, res) => {
  const { bookId, bookTitle, type, quantity } = req.body;
  const id = genId();
  const date = new Date().toISOString();

  const sql = 'INSERT INTO transactions (id, bookId, bookTitle, type, quantity, date) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [id, bookId, bookTitle, type, quantity, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Update book stock
    const updateSql = type === 'Add Stock' 
      ? 'UPDATE books SET quantity = quantity + ? WHERE id = ?'
      : 'UPDATE books SET quantity = quantity - ? WHERE id = ?';
      
    db.query(updateSql, [quantity, bookId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ id, bookId, bookTitle, type, quantity, date });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));