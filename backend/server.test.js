// Unit tests — use in-memory mock, no real DB needed
const request = require('supertest');

// Mock mongoose before requiring server
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue(true),
    connection: { readyState: 1 },
    Schema: actual.Schema,
    model: jest.fn(),
  };
});

// Mock Todo model
const mockTodos = [];
const MockTodo = {
  find: jest.fn(() => ({ sort: jest.fn().mockResolvedValue(mockTodos) })),
  create: jest.fn(data => Promise.resolve({ _id: 'abc123', ...data, completed: false })),
  findByIdAndUpdate: jest.fn((id, update) =>
    Promise.resolve(id === 'valid' ? { _id: id, ...update.$set } : null)
  ),
  findByIdAndDelete: jest.fn(id =>
    Promise.resolve(id === 'valid' ? { _id: id } : null)
  ),
  countDocuments: jest.fn().mockResolvedValue(0),
};

require('mongoose').model.mockReturnValue(MockTodo);

const { app, server } = require('./server');

afterAll(() => server.close());

describe('TaskFlow API', () => {
  test('GET /health returns OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('GET /api/todos returns array', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/todos creates todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ text: 'Deploy to AWS', priority: 'High' });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Deploy to AWS');
  });

  test('POST /api/todos returns 400 if text missing', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.statusCode).toBe(400);
  });

  test('PATCH /api/todos/:id returns 404 for invalid id', async () => {
    const res = await request(app)
      .patch('/api/todos/invalid')
      .send({ completed: true });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /api/todos/:id returns 404 for invalid id', async () => {
    const res = await request(app).delete('/api/todos/invalid');
    expect(res.statusCode).toBe(404);
  });
});
