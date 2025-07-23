const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error('Could not connect to MySQL database', err);
  } else {
    console.log('Connected to MySQL database');
    // Create the tasks table if it doesn't exist
    const initSql = `CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      priority VARCHAR(20),
      dueDate DATETIME,
      reminderTime VARCHAR(255),
      completed TINYINT DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
    db.query(initSql, (err) => {
      if (err) console.error('Error creating tasks table:', err);
    });
  }
});

module.exports = db;