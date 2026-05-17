const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory repository
const tasks = new Map();

function nowISO() {
  return new Date().toISOString();
}

function createTask({ title, description, reminder_at }) {
  const id = uuidv4();
  const task = {
    id,
    title,
    description: description || '',
    reminder_at: reminder_at || null,
    created_at: nowISO(),
    status: 'pending'
  };
  tasks.set(id, task);
  return task;
}

function listTasks({ status, highlight_threshold_hours } = {}) {
  const array = Array.from(tasks.values());
  // sort by status (pending first), then by reminder_at asc, tasks without reminder at the end
  const statusOrder = { 'pending': 0, 'cancelled': 1, 'completed': 2 };
  array.sort((a, b) => {
    const sa = statusOrder[a.status] ?? 99;
    const sb = statusOrder[b.status] ?? 99;
    if (sa !== sb) return sa - sb;
    const ra = a.reminder_at ? new Date(a.reminder_at).getTime() : Infinity;
    const rb = b.reminder_at ? new Date(b.reminder_at).getTime() : Infinity;
    return ra - rb;
  });

  const now = Date.now();
  const thresholdMs = (highlight_threshold_hours || 24) * 3600 * 1000;
  const result = array.map(t => ({
    ...t,
    highlight: t.reminder_at ? (new Date(t.reminder_at).getTime() - now) <= thresholdMs && new Date(t.reminder_at).getTime() >= now : false
  }));
  if (status) return result.filter(r => r.status === status);
  return result;
}

function updateStatus(id, status) {
  const task = tasks.get(id);
  if (!task) return null;
  task.status = status;
  tasks.set(id, task);
  return task;
}

function deleteTask(id) {
  const task = tasks.get(id);
  if (!task) return { ok: false, code: 404 };
  if (!['completed', 'cancelled'].includes(task.status)) return { ok: false, code: 400 };
  tasks.delete(id);
  return { ok: true };
}

// Seed with some mock data
createTask({ title: 'Comprar leite', description: '', reminder_at: new Date(Date.now() + 2 * 3600 * 1000).toISOString() });
createTask({ title: 'Enviar relatório', description: '', reminder_at: new Date(Date.now() + 26 * 3600 * 1000).toISOString() });
createTask({ title: 'Limpar Inbox', description: '', reminder_at: null });

// Routes
app.post('/tasks', (req, res) => {
  const { title, description, reminder_at } = req.body;
  if (!title || title.trim() === '') return res.status(400).json({ error: 'title is required' });
  if (reminder_at && new Date(reminder_at) <= new Date()) return res.status(400).json({ error: 'reminder_at must be in the future' });
  const task = createTask({ title: title.trim(), description, reminder_at });
  console.log('task.created', { id: task.id, title: task.title });
  return res.status(201).json(task);
});

app.get('/tasks', (req, res) => {
  const { status, highlight_threshold_hours } = req.query;
  const list = listTasks({ status, highlight_threshold_hours: Number(highlight_threshold_hours) || undefined });
  return res.json(list);
});

app.patch('/tasks/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'completed', 'cancelled'].includes(status)) return res.status(400).json({ error: 'invalid status' });
  const task = updateStatus(id, status);
  if (!task) return res.status(404).json({ error: 'not found' });
  console.log('task.updated', { id: task.id, status: task.status });
  return res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const result = deleteTask(id);
  if (!result.ok) return res.status(result.code).json({ error: 'cannot delete' });
  console.log('task.deleted', { id });
  return res.status(204).send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on ${port}`));
