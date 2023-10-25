const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();



app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('mydatabase.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
});

// REST API for CRUD operations

// Create
app.post('/items', (req, res) => {
  const { name } = req.body;
  const stmt = db.prepare('INSERT INTO items (name) VALUES (?)');
  stmt.run(name, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item added' });
  });
  stmt.finalize();
});

// Read
app.get('/items', (req, res) => {
  db.all('SELECT * FROM items', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Update
app.put('/items/:id', (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const stmt = db.prepare('UPDATE items SET name = ? WHERE id = ?');
  stmt.run(name, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item updated' });
  });
  stmt.finalize();
});

// Delete
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM items WHERE id = ?');
  stmt.run(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item deleted' });
  });
  stmt.finalize();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
