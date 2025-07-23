const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const taskRoutes = require('./routes/tasks.cjs');
const geminiRoutes = require('./routes/gemini.cjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/gemini', geminiRoutes);

app.use((err, req, res, next) => {
    console.error('UNCAUGHT ERROR:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  });

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
