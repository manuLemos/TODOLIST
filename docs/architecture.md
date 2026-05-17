# Arquitetura

O projeto segue arquitetura MVC e está organizado como mono-repo. Objetivos e justificativas:

- **MVC**: Separação clara entre domínio (Model), apresentação (View) e orquestração (Controller) facilita testes, manutenção e substituição de camadas.
- **Mono-repo**: Facilita compartilhamento de utilitários, coesão entre frontend e backend e manutenção de scripts/CI centralizados.
- **Dados em memória**: Escolhido para simplificar implantação e permitir desenvolvimento rápido; facilita demonstração de comportamento.

## Estrutura de Diretórios

```
src/
├── api/                    # Backend: Controllers + Models + Repositórios
│   ├── models/            # Entidades de domínio e validações
│   ├── controllers/       # Handlers HTTP, orquestração
│   ├── repositories/      # Acesso a dados (em memória)
│   ├── routes.js         # Definição de rotas
│   ├── index.js          # Entry point
│   └── package.json
├── web/                    # Frontend: Views + Controllers + Assets
│   ├── views/            # Páginas HTML
│   ├── controllers/      # Lógica de UI e eventos
│   ├── styles/           # CSS
│   ├── index.html
│   ├── app.js
│   └── package.json
```

## Como a Constituição Guiou Escolhas

Consulte [Constituição do Projeto](../.specify/memory/constitution.md) para padrões de projeto e boas práticas.

Para detalhes, exemplos práticos e justificativas profundas de cada prática, veja [Práticas e Padrões](practices.md):

- [Padrões Arquiteturais](practices.md#padrões-arquiteturais): MVC, Mono-Repo, Estrutura de Pastas
- [Padrões de Código](practices.md#padrões-de-código): Naming Conventions, Code Style, SRP
- [Boas Práticas de Desenvolvimento](practices.md#boas-práticas-de-desenvolvimento): Testes, Code Review, Logs, Versionamento
- [Boas Práticas de UX](practices.md#boas-práticas-de-ux): Responsividade, Acessibilidade, Performance
- [Boas Práticas de Documentação](practices.md#boas-práticas-de-documentação): Docs Técnicas, Comentários, Changelog

## Fluxo de Dados

```
Request HTTP (Cliente)
    ↓
Router (routes.js)
    ↓
Controller (ex: TaskController)
    ├→ Valida entrada
    ├→ Chama Model/Repository
    └→ Formata resposta
         ↓
Response HTTP (Cliente)
```

## Camadas Detalhadas

### Model (src/api/models/)
- Definição de entidades (Task, User, etc).
- Validações lógicas.
- Métodos de manipulação de dados (ex: `markAsComplete()`).

**Exemplo:**
```javascript
class Task {
  constructor(id, title, completed = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }

  isValid() {
    return this.title && this.title.length > 0;
  }
}
```

### Repository (src/api/repositories/)
- Acesso a dados (em memória, BD futuro, etc).
- Métodos CRUD (Create, Read, Update, Delete).
- Sem lógica de negócio, apenas persistência.

**Exemplo:**
```javascript
class TaskRepository {
  constructor() {
    this.tasks = [];
  }

  save(task) {
    if (!task.isValid()) throw new Error('Invalid task');
    this.tasks.push(task);
    return task;
  }

  findById(id) {
    return this.tasks.find(t => t.id === id);
  }
}
```

### Controller (src/api/controllers/)
- Orquestra Model + Repository.
- Valida entrada HTTP.
- Formata resposta.
- Trata erros.

**Exemplo:**
```javascript
class TaskController {
  constructor(repository) {
    this.repository = repository;
  }

  createTask(req, res) {
    try {
      const task = new Task(Date.now(), req.body.title);
      const saved = this.repository.save(task);
      res.json({ success: true, data: saved });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
```

### View (src/web/)
- HTML estático.
- CSS responsivo com design tokens.
- JavaScript para interações (DOM manipulation, eventos).
- Nenhuma lógica de negócio.

**Exemplo:**
```html
<form id="task-form">
  <input type="text" id="task-input" placeholder="New task...">
  <button type="submit">Add</button>
</form>

<ul id="task-list"></ul>

<script>
  document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('task-input').value;
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.json();
    if (json.success) {
      renderTask(json.data);
      document.getElementById('task-input').value = '';
    }
  });
</script>
```

## Razões Arquiteturais

| Decisão | Razão | Trade-off |
|---------|-------|-----------|
| MVC | Separação de responsabilidades, testabilidade | Mais arquivos inicialmente |
| Mono-repo | Sincronização frontend/backend, code sharing | Único repositório para gerenciar |
| Dados em memória | Simplicidade, zero setup BD | Dados perdidos ao reiniciar |

## Extensões Futuras

- **Persistência**: Migrar `TaskRepository` para usar banco de dados sem quebrar Controllers/Models.
- **Autenticação**: Adicionar middleware de auth entre Router e Controller.
- **Mobile**: Reutilizar Models/Repositories com novo frontend mobile.


