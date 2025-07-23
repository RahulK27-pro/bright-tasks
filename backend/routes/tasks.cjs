const express = require('express');
const router = express.Router();
const db = require('../db.cjs');

// Add new task
router.post('/', (req, res) => {
  const { title, description, priority, dueDate, reminderTime, completed } = req.body;
  db.query(
    `INSERT INTO tasks (title, description, priority, dueDate, reminderTime, completed) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description || '', priority, dueDate || null, reminderTime || '', completed ? 1 : 0],
    (err, result) => {
      if (err) {
        console.error('INSERT ERROR:', err); // <-- Add this line
        return res.status(500).send({ error: err.message, details: err });
      }
      res.send({ id: result.insertId });
    }
  );
});

// Get all tasks
router.get('/', (req, res) => {
  db.query(`SELECT * FROM tasks`, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// Update a task
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, priority, dueDate, reminderTime, completed } = req.body;
  db.query(
    `UPDATE tasks SET title=?, description=?, priority=?, dueDate=?, reminderTime=?, completed=? WHERE id=?`,
    [title, description || '', priority, dueDate || null, reminderTime || '', completed ? 1 : 0, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ success: true });
    }
  );
});

// Delete a task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM tasks WHERE id=?`, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ success: true });
  });
});

module.exports = router;
