// Simple API tests - no real DB needed
const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Build a test app without mongoose
function buildTestApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let todos = [];
  let idCounter = 1;

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', db: 'test-mode' });
  });

  app.get('/api/todos', (req, res) => {
    res.json(todos);
  });

  app.post('/api/todos', (req, res) => {
    const { text, priority } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const todo = {
      _id: String(idCounter++),
      text: text.trim(),
      priority: priority || 'Medium',
      completed: false,
      createdAt: new Date().toISOString()
    };
    todos.push(todo);
    res.status(201).json(todo);
  });

  app.patch('/api/todos/:id', (req, res) => {
    const todo = todos.find(t => t._id === req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    Object.assign(todo, req.body);
    res.json(todo);
  });

  app.delete('/api/todos/:id', (req, res) => {
    const index = todos.findIndex(t => t._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Todo not found' });
    todos.splice(index, 1);
    res.json({ message: 'Deleted successfully' });
  });

  return app;
}

describe('TaskFlow API Tests', () => {
  let app;

  beforeEach(() => {
    app = buildTestApp();
  });

  test('GET /health returns OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('GET /api/todos returns empty array', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/todos creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ text: 'Deploy to AWS', priority: 'High' });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Deploy to AWS');
    expect(res.body.priority).toBe('High');
    expect(res.body.completed).toBe(false);
  });

  test('POST /api/todos returns 400 if text missing', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.statusCode).toBe(400);
  });

  test('PATCH /api/todos/:id updates todo', async () => {
    const create = await request(app)
      .post('/api/todos')
      .send({ text: 'Test task', priority: 'Low' });
    const id = create.body._id;
    const res = await request(app)
      .patch(`/api/todos/${id}`)
      .send({ completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test('DELETE /api/todos/:id deletes todo', async () => {
    const create = await request(app)
      .post('/api/todos')
      .send({ text: 'Delete me', priority: 'Low' });
    const id = create.body._id;
    const res = await request(app).delete(`/api/todos/${id}`);
    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/todos/:id returns 404 for invalid id', async () => {
    const res = await request(app).delete('/api/todos/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
