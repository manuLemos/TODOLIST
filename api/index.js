const express = require('express');
const bodyParser = require('body-parser');
const { createTask, listTasks, updateStatus, deleteTask } = require('./_store');

const app = express();
app.use(bodyParser.json());

app.post('/api/tasks', (req, res) => {
  const { title, description, reminder_at } = req.body;
  if (!title || title.trim() === '') return res.status(400).json({ error: 'title is required' });
  if (reminder_at && new Date(reminder_at) <= new Date()) return res.status(400).json({ error: 'reminder_at must be in the future' });
  const task = createTask({ title: title.trim(), description, reminder_at });
  return res.status(201).json(task);
});

app.get('/api/tasks', (req, res) => {
  const { status, highlight_threshold_hours } = req.query;
  const list = listTasks({ status, highlight_threshold_hours: Number(highlight_threshold_hours) || undefined });
  return res.json(list);
});

app.patch('/api/tasks/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'completed', 'cancelled'].includes(status)) return res.status(400).json({ error: 'invalid status' });
  const task = updateStatus(id, status);
  if (!task) return res.status(404).json({ error: 'not found' });
  return res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const result = deleteTask(id);
  if (!result.ok) return res.status(result.code).json({ error: 'cannot delete' });
  return res.status(204).send();
});

module.exports = app;
