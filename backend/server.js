require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/taskflow';

// ── Middleware ────────────────────────────────
app.use(cors());
app.use(express.json());

// ── MongoDB Connection ────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// ── Todo Model ────────────────────────────────
const todoSchema = new mongoose.Schema({
  text:      { type: String, required: true, trim: true, maxlength: 200 },
  completed: { type: Boolean, default: false },
  priority:  { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// ── Health Check ──────────────────────────────
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    database: dbStatus,
    uptime: process.uptime(),
  });
});

// ── Metrics (Prometheus) ──────────────────────
app.get('/metrics', async (req, res) => {
  const total = await Todo.countDocuments();
  const completed = await Todo.countDocuments({ completed: true });
  res.set('Content-Type', 'text/plain');
  res.send(
    `# HELP todo_total Total todos\n# TYPE todo_total gauge\ntodo_total ${total}\n` +
    `# HELP todo_completed Completed todos\n# TYPE todo_completed gauge\ntodo_completed ${completed}\n`
  );
});

// ── CRUD Routes ───────────────────────────────

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text, priority } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const todo = await Todo.create({ text: text.trim(), priority });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update todo (toggle complete or edit text)
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ──────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

module.exports = { app, server };
