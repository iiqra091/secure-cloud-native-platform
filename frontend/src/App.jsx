import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API = '/api/todos'

const FILTERS = ['All', 'Active', 'Completed']
const PRIORITIES = ['Low', 'Medium', 'High']

function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  // Fetch all todos on mount
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API)
      setTodos(res.data)
      setError(null)
    } catch {
      setError('Cannot connect to backend. Is it running?')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      const res = await axios.post(API, { text: text.trim(), priority })
      setTodos([res.data, ...todos])
      setText('')
      setPriority('Medium')
    } catch {
      setError('Failed to add task')
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const res = await axios.patch(`${API}/${todo._id}`, {
        completed: !todo.completed,
      })
      setTodos(todos.map(t => t._id === todo._id ? res.data : t))
    } catch {
      setError('Failed to update task')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
      setTodos(todos.filter(t => t._id !== id))
    } catch {
      setError('Failed to delete task')
    }
  }

  const startEdit = (todo) => {
    setEditId(todo._id)
    setEditText(todo.text)
  }

  const saveEdit = async (id) => {
    if (!editText.trim()) return
    try {
      const res = await axios.patch(`${API}/${id}`, { text: editText.trim() })
      setTodos(todos.map(t => t._id === id ? res.data : t))
      setEditId(null)
    } catch {
      setError('Failed to edit task')
    }
  }

  const clearCompleted = async () => {
    const completed = todos.filter(t => t.completed)
    await Promise.all(completed.map(t => axios.delete(`${API}/${t._id}`)))
    setTodos(todos.filter(t => !t.completed))
  }

  const filtered = todos.filter(t => {
    if (filter === 'Active') return !t.completed
    if (filter === 'Completed') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  const priorityColor = (p) => {
    if (p === 'High') return '#ff6b6b'
    if (p === 'Medium') return '#ffd93d'
    return '#6bcb77'
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">✅</span>
            <div>
              <h1>TaskFlow</h1>
              <p>DevOps 3-Tier Todo App</p>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <span className="stat-num">{todos.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-num" style={{ color: '#6bcb77' }}>{completedCount}</span>
              <span className="stat-label">Done</span>
            </div>
            <div className="stat">
              <span className="stat-num" style={{ color: '#ffd93d' }}>{activeCount}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            ⚠️ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Add Todo Form */}
        <div className="card add-card">
          <h2>Add New Task</h2>
          <form onSubmit={addTodo} className="add-form">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="text-input"
              maxLength={200}
            />
            <div className="form-bottom">
              <div className="priority-select">
                <span>Priority:</span>
                {PRIORITIES.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-btn ${priority === p ? 'active' : ''}`}
                    style={{ '--p-color': priorityColor(p) }}
                    onClick={() => setPriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button type="submit" className="add-btn">
                + Add Task
              </button>
            </div>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="filter-bar">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="filter-count">
                {f === 'All' ? todos.length
                  : f === 'Active' ? activeCount
                  : completedCount}
              </span>
            </button>
          ))}
          {completedCount > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear Completed
            </button>
          )}
        </div>

        {/* Todo List */}
        <div className="card todo-card">
          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>Loading tasks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">
                {filter === 'Completed' ? '🎉' : '📝'}
              </span>
              <p>
                {filter === 'Completed'
                  ? 'No completed tasks yet'
                  : 'No tasks here. Add one above!'}
              </p>
            </div>
          ) : (
            <ul className="todo-list">
              {filtered.map(todo => (
                <li
                  key={todo._id}
                  className={`todo-item ${todo.completed ? 'completed' : ''}`}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`checkbox ${todo.completed ? 'checked' : ''}`}
                    onClick={() => toggleTodo(todo)}
                    title="Mark complete"
                  >
                    {todo.completed && (
                      <svg viewBox="0 0 12 10" fill="none">
                        <polyline points="1,5 4,9 11,1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  <div className="todo-body">
                    {editId === todo._id ? (
                      <input
                        className="edit-input"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEdit(todo._id)
                          if (e.key === 'Escape') setEditId(null)
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="todo-text">{todo.text}</span>
                    )}
                    <span
                      className="priority-badge"
                      style={{ background: priorityColor(todo.priority) + '22', color: priorityColor(todo.priority) }}
                    >
                      {todo.priority}
                    </span>
                  </div>

                  <div className="todo-actions">
                    {editId === todo._id ? (
                      <>
                        <button className="action-btn save" onClick={() => saveEdit(todo._id)}>Save</button>
                        <button className="action-btn cancel" onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          className={`action-btn complete-btn ${todo.completed ? 'undo' : 'done'}`}
                          onClick={() => toggleTodo(todo)}
                        >
                          {todo.completed ? 'Undo' : '✓ Done'}
                        </button>
                        <button className="action-btn edit" onClick={() => startEdit(todo)} title="Edit">✏️</button>
                        <button className="action-btn delete" onClick={() => deleteTodo(todo._id)} title="Delete">🗑️</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tech Stack Badge */}
        <div className="tech-stack">
          <span>⚛️ React</span>
          <span>+</span>
          <span>🟢 Node.js</span>
          <span>+</span>
          <span>🍃 MongoDB</span>
          <span>+</span>
          <span>🐳 Docker</span>
        </div>
      </main>
    </div>
  )
}

export default App
