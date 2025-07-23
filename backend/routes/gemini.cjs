const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const db = require('../db.cjs');

router.post('/prioritize', async (req, res) => {
  // Fetch all tasks from the database
  db.query('SELECT * FROM tasks', async (err, tasks) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send('Database error');
    }
    if (!tasks || tasks.length === 0) {
      return res.status(400).json({ response: 'No tasks found in the database.' });
    }

    const prompt = `
You are a task assistant AI. Given a list of tasks, prioritize them from highest to lowest importance. 
Each task has a title, deadline, and priority.

Tasks:
${tasks.map((t, i) => `${i + 1}. Title: ${t.title}, Deadline: ${t.dueDate ? t.dueDate.toISOString ? t.dueDate.toISOString() : t.dueDate : ''}, Priority: ${t.priority}`).join('\n')}
`;

    try {
      const response = await axios.post(GEMINI_URL, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data.candidates[0].content.parts[0].text;
      res.json({ response: result });
    } catch (error) {
      console.error("Gemini error:", error.response?.data || error.message);
      res.status(500).send("Gemini API error");
    }
  });
});

module.exports = router;
