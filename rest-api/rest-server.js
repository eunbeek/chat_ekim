const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./configs/postgres_db');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

// ========== User Management API ==========

// 1. Create User (POST /api/user)
app.post('/api/user', async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Email and Name are required' });
  }
 
  try {
    // create user in db
    const result = await pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
      [email, name]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// 2. Read All Users (GET /api/users)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// 3. Read One User by email (GET /api/user?email=)
app.get('/api/user', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email query parameter is required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

// ========== Message Management API ==========

// 1. Create Message (POST /api/messages)
app.post('/api/messages', async (req, res) => {
  const { message, user_id } = req.body;
  if (!message || !user_id) {
    return res.status(400).json({ success: false, message: 'Message and user_id are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (message, user_id) VALUES ($1, $2) RETURNING *',
      [message, user_id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to save message' });
  }
});

// 2. Read All Messages (GET /api/messages)
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT messages.id, messages.message, messages.created_at, messages.user_id, users.email, users.name
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY messages.created_at ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// 3. Delete All Messages (DELETE /api/messages)
app.delete('/api/messages', async (req, res) => {
  try {
    await pool.query('DELETE FROM messages');
    res.json({ success: true, message: 'All messages deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete messages' });
  }
});

// 4. Delete Message by id (DELETE /api/message)
app.delete('/api/message', async (req, res) => {
  try {
    const { id } = req.query;
    await pool.query('DELETE FROM messages WHERE id=$1',[id]);
    res.json({ success: true, message: `${id} message deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

// run server with 3001 port
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`REST API server running on http://localhost:${PORT}`);
});
