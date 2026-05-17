const { v4: uuidv4 } = require('uuid');

// Simple in-memory store (note: serverless environments may be ephemeral)
const tasks = new Map();

function nowISO() { return new Date().toISOString(); }

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

// Seed some data if empty
if (tasks.size === 0) {
  createTask({ title: 'Comprar leite', description: '', reminder_at: new Date(Date.now() + 2 * 3600 * 1000).toISOString() });
  createTask({ title: 'Enviar relatório', description: '', reminder_at: new Date(Date.now() + 26 * 3600 * 1000).toISOString() });
  createTask({ title: 'Limpar Inbox', description: '', reminder_at: null });
}

module.exports = { createTask, listTasks, updateStatus, deleteTask };
