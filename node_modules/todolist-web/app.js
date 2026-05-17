const apiBase =
  window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

async function fetchTasks(){
  const res = await fetch(`${apiBase}/tasks`);
  return res.json();
}

function formatDate(iso){
  if(!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}

function isHighlight(reminder_at, thresholdHours=24){
  if(!reminder_at) return false;
  const now = Date.now();
  const r = new Date(reminder_at).getTime();
  const ms = thresholdHours * 3600 * 1000;
  return r >= now && (r - now) <= ms;
}

function render(tasks){
  const ul = document.getElementById('tasks');
  ul.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = `task status-${t.status}`;

    const left = document.createElement('div');
    left.className = 'left';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = t.title;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${formatDate(t.reminder_at)} • ${t.status}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement('div');
    right.style.display = 'flex';
    right.style.alignItems = 'center';

    if (t.highlight) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = 'Lembrete Próximo';
      right.appendChild(badge);
    }

    const statusLabel = document.createElement('span');
    statusLabel.className = `status-label ${t.status}`;
    statusLabel.textContent = t.status.toUpperCase();
    right.appendChild(statusLabel);

    const actions = document.createElement('div');
    actions.className = 'actions';

    if(t.status === 'pending'){
      const btn = document.createElement('button');
      btn.className = 'primary';
      btn.textContent = 'Concluir';
      btn.onclick = async ()=>{
        await fetch(`${apiBase}/tasks/${t.id}/status`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'completed'})});
        load();
      };
      actions.appendChild(btn);
    }
    if(['completed','cancelled'].includes(t.status)){
      const del = document.createElement('button');
      del.className = 'danger';
      del.textContent = 'Remover';
      del.onclick = async ()=>{ await fetch(`${apiBase}/tasks/${t.id}`,{method:'DELETE'}); load(); };
      actions.appendChild(del);
    }

    right.appendChild(actions);

    li.appendChild(left);
    li.appendChild(right);
    ul.appendChild(li);
  });
}

async function load(){
  const tasks = await fetchTasks();
  render(tasks);
}

document.getElementById('create').addEventListener('click', async ()=>{
  const title = document.getElementById('title').value;
  const reminder = document.getElementById('reminder').value;
  await fetch(`${apiBase}/tasks`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,reminder_at:reminder?new Date(reminder).toISOString():null})});
  document.getElementById('title').value = '';
  document.getElementById('reminder').value = '';
  load();
});

load();
