# Práticas e Padrões

Documento detalhado de boas práticas e padrões de engenharia de software adotados no projeto TODOLIST. Cada prática inclui justificativa, exemplos e referências para implementação.

---

## Índice

1. [Padrões Arquiteturais](#padrões-arquiteturais)
   - MVC
   - Mono-Repo
   - Estrutura de Pastas
2. [Padrões de Código](#padrões-de-código)
   - Naming Conventions
   - Code Style Automatizado
   - Single Responsibility Principle
3. [Boas Práticas de Desenvolvimento](#boas-práticas-de-desenvolvimento)
   - Testes
   - Code Review
   - Tratamento de Erros e Logs
   - Versionamento Semântico
4. [Boas Práticas de UX](#boas-práticas-de-ux)
   - Design Responsivo
   - Acessibilidade
   - Performance Percebida
   - Consistência Visual
5. [Boas Práticas de Documentação](#boas-práticas-de-documentação)
   - Documentação Técnica
   - Comentários no Código
   - Changelog

---

## Padrões Arquiteturais

### MVC (Model-View-Controller)

**Definição:**
Separação da aplicação em três camadas independentes:

- **Model**: Contém a lógica de negócio, validações, acesso a dados e repositórios.
- **View**: Responsável pela apresentação visual e interação com o usuário.
- **Controller**: Orquestra a comunicação entre Model e View, valida entrada e formata respostas.

**Exemplo:**

```
src/api/
  ├── models/
  │   └── Task.js          # Lógica de tarefa, validações
  ├── controllers/
  │   └── TaskController.js # Orquestração, rotas HTTP
  └── repositories/
      └── TaskRepository.js # Acesso a dados (em memória)

src/web/
  ├── views/
  │   └── TaskList.html    # Renderização de tarefas
  └── controllers/
      └── app.js           # Lógica de UI e eventos
```

**Justificativas:**

1. **Testabilidade**: Model pode ser testado isoladamente sem dependencies de View/HTTP.
2. **Manutenibilidade**: Mudanças de UI não afetam lógica de negócio.
3. **Reusabilidade**: Model pode ser acessado por múltiplas Views (web, mobile, CLI).
4. **Escalabilidade**: Novas features podem ser adicionadas sem quebrar camadas existentes.

**Quando Usar:**
✅ Sempre—é o padrão mandatório do projeto.

**Quando Não Usar:**
❌ Nunca. MVC é obrigatório em toda a arquitetura.

---

### Mono-Repo

**Definição:**
Múltiplos pacotes/aplicações gerenciadas em um único repositório Git com:

- Dependências compartilhadas (package.json raiz).
- Scripts de build, teste e CI centralizados.
- Histórico de código coesivo.

**Estrutura:**

```
TODOLIST/
├── src/
│   ├── api/      # Backend
│   └── web/      # Frontend
├── docs/         # Documentação
├── package.json  # Dependências raiz
└── mkdocs.yml    # Config MkDocs
```

**Justificativas:**

1. **Sincronização**: Frontend e backend evoluem juntos; breaking changes são detectados imediatamente.
2. **Code Sharing**: Utilitários, tipos, constantes compartilhados sem publish/versioning.
3. **CI Simplificado**: Apenas um repositório para configurar webhooks, secrets, etc.
4. **Onboarding**: Nova pessoa clona um repo, não três.

**Exemplo de Compartilhamento:**

```javascript
// src/shared/constants.js (hipotético)
export const MAX_TASKS = 100;
export const TASK_STATUS = { PENDING: 'pending', DONE: 'done' };

// src/api/controllers/TaskController.js
import { MAX_TASKS, TASK_STATUS } from '../shared/constants.js';

// src/web/app.js
import { TASK_STATUS } from '../shared/constants.js';
```

**Quando Usar:**
✅ Projeto com múltiplos pacotes fortemente relacionados (frontend + backend, services relacionados).
❌ Não usar se pacotes são independentes ou com ciclos de release diferentes.

---

### Estrutura de Pastas

**Padrão:**

```
src/
├── api/                 # Backend
│   ├── models/         # Entidades, validações
│   ├── controllers/    # Handlers de requisições
│   ├── repositories/   # Acesso a dados
│   ├── routes.js       # Definição de rotas
│   ├── index.js        # Entry point
│   └── package.json
├── web/                # Frontend
│   ├── views/         # Páginas HTML
│   ├── controllers/   # Lógica de UI
│   ├── styles/        # CSS
│   ├── index.html
│   ├── app.js         # Entry point
│   └── package.json
├── docs/              # Documentação (MkDocs)
│   ├── index.md
│   ├── architecture.md
│   ├── practices.md
│   └── run.md
├── mkdocs.yml         # Configuração MkDocs
├── package.json       # Dependências raiz
└── README.md
```

**Justificativas:**

1. **Previsibilidade**: Novo desenvolvedora sabe onde procurar.
2. **Escalabilidade**: Estrutura suporta crescimento sem refatoração radical.
3. **Separação de Concerns**: Backend isolado de frontend.
4. **Dokumentação Centralizada**: docs/ em uma localização clara.

---

## Padrões de Código

### Naming Conventions

**Convenções:**

| Elemento | Padrão | Exemplo |
|----------|--------|---------|
| Arquivos JS | `camelCase.js` ou `kebab-case.js` | `taskController.js`, `task-repository.js` |
| Classes/Constructores | `PascalCase` | `class TaskRepository { }` |
| Funções/Métodos | `camelCase` | `function getTasks() { }` |
| Constantes | `UPPER_SNAKE_CASE` | `const MAX_RETRIES = 3;` |
| Variáveis | `camelCase` | `let activeTaskCount = 0;` |
| Booleanos | `is*`, `has*`, `can*` | `isCompleted`, `hasChildren`, `canDelete` |

**Exemplos:**

```javascript
// ✅ Bom
class TaskRepository {
  constructor() {
    this.MAX_TASKS = 100;
  }

  getTasks(userId) {
    const userTasks = [];
    const isActive = true;
    return userTasks.filter(t => t.isActive === isActive);
  }
}

// ❌ Ruim
class taskRepository {
  constructor() {
    this.max_tasks = 100;
  }

  get_tasks(user_id) {
    const UserTasks = [];
    return UserTasks;
  }
}
```

**Justificativas:**

1. **Consistência**: Codebase inteira segue padrão único.
2. **Legibilidade**: Tipo de elemento é evidente pelo padrão de nome.
3. **Busca**: Padrões consistentes facilitam grep/search.
4. **Revisão**: Menos comentários em code reviews sobre estilo.

---

### Code Style Automatizado

**Ferramentas:**

- **Prettier**: Formatação automática (indentação, espaçamento, etc).
- **ESLint**: Detecção de bugs e anti-patterns.
- **Pre-commit Hooks**: Lint/format automático antes de commit.

**Configuração Recomendada:**

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

```json
// .eslintrc.json
{
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "extends": ["eslint:recommended"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

**Scripts no package.json:**

```json
{
  "scripts": {
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "lint:check": "eslint src/ && prettier --check src/"
  }
}
```

**CI Obrigatório:**

```yaml
# Exemplo GitHub Actions
- name: Lint
  run: npm run lint:check
```

**Justificativas:**

1. **Objetividade**: Remove decisões subjetivas sobre estilo.
2. **Automação**: Desenvolvedor não precisa pensar em formatação.
3. **PRs Limpas**: Diffs mostram apenas lógica, não mudanças de espaçamento.
4. **Consistência Global**: Mesmo desenvolvedor novo segue padrão sem esforço.

---

### Single Responsibility Principle (SRP)

**Definição:**
Cada classe/função deve ter uma única razão para mudar. Responsabilidade = razão para mudar.

**Exemplos:**

```javascript
// ✅ Bom - Responsabilidades separadas
class Task {
  constructor(id, title, completed) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }

  isValid() {
    return this.title && this.title.length > 0;
  }
}

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

class TaskController {
  constructor(repository) {
    this.repository = repository;
  }

  createTask(req, res) {
    try {
      const task = new Task(1, req.body.title, false);
      const saved = this.repository.save(task);
      res.json({ success: true, data: saved });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

// ❌ Ruim - Responsabilidades misturadas
class TaskManager {
  createTask(title) {
    if (!title || title.length === 0) {
      throw new Error('Invalid title');
    }
    const task = { id: Date.now(), title, completed: false };
    // Salvando em array
    if (!this.tasks) this.tasks = [];
    this.tasks.push(task);
    // Formatando resposta HTTP
    return { success: true, statusCode: 201, data: task };
  }
}
```

**Benefícios:**

1. **Testabilidade**: Cada classe testada independentemente.
2. **Reusabilidade**: `TaskRepository` pode ser usado por diferentes controllers.
3. **Manutenibilidade**: Mudanças de lógica isoladas em uma classe.
4. **Flexibilidade**: Trocar repositório de dados sem afetar Task.

---

## Boas Práticas de Desenvolvimento

### Testes

**Tipos de Testes:**

1. **Unitários**: Testa função/método isolado com mocks de dependências.
2. **Integração**: Testa múltiplas camadas juntas (ex: Controller + Repository).
3. **E2E**: Testa fluxo completo do usuário (ex: criar tarefa via UI).

**Estrutura:**

```javascript
// ✅ Exemplo com Jest
describe('TaskRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new TaskRepository();
  });

  describe('save()', () => {
    it('should save a valid task', () => {
      const task = new Task(1, 'Buy milk', false);
      const saved = repository.save(task);
      expect(saved.id).toBe(1);
      expect(repository.findById(1)).toEqual(task);
    });

    it('should throw error for invalid task', () => {
      const invalidTask = new Task(1, '', false);
      expect(() => repository.save(invalidTask)).toThrow();
    });
  });

  describe('findById()', () => {
    it('should return task if found', () => {
      const task = new Task(1, 'Buy milk', false);
      repository.save(task);
      expect(repository.findById(1)).toEqual(task);
    });

    it('should return undefined if not found', () => {
      expect(repository.findById(999)).toBeUndefined();
    });
  });
});
```

**Cobertura Mínima:**

- ✅ Lógica crítica: 80%+
- ✅ Validações: 100%
- ✅ Casos extremos (empty, null, duplicatas): cobertura completa

**Quando Testar:**

- Funções puras (sem side effects).
- Validações.
- Repositórios/Acesso a dados.
- Controllers (mocks de repository).

**Justificativas:**

1. **Confiança**: Mudanças seguras com testes verde.
2. **Documentação Viva**: Testes mostram como usar o código.
3. **Bugs Reduzidos**: Problemas detectados antes de produção.
4. **Refatoração Segura**: Remover código técnico sem quebrar comportamento.

---

### Code Review

**Processo:**

1. **PR Pequena**: Máx 400 linhas quando possível; se >400, dividir.
2. **Descrição Clara**: "O quê", "por quê", screenshot se UI.
3. **Checklist**:
   - ✅ Testes adicionados/atualizados.
   - ✅ Documentação atualizada.
   - ✅ Sem console.log/debugger.
   - ✅ Lint/format passou.
   - ✅ Segue padrões do projeto.
4. **Aprovação**: ≥1 reviewer.
5. **Merge**: Após aprovação; deletar branch.

**Exemplo de Boa Descrição:**

```markdown
## O quê
Implementa feature de marcar tarefas como concluídas.

## Por quê
Usuário precisa indicar progresso nas tarefas.

## Como Testar
1. Criar nova tarefa
2. Clicar checkbox para marcar concluída
3. Verificar se status muda e é salvo

## Screenshots
[Imagem da UI]

## Breaking Changes
Nenhuma.

## Checklist
- [x] Testes adicionados (test coverage: 85%)
- [x] Documentação atualizada (docs/api.md)
- [x] Lint passou (npm run lint:check)
- [x] Sem console.log/debugger
```

**Feedback Construtivo:**

```
❌ "Isso está errado."
✅ "Sugerindo usar `const` em vez de `let` aqui para evitar reatribuição acidental. Preferência do projeto (see constitution.md)."

❌ "Falta teste."
✅ "Testamos essa função em TaskRepository? Se não, sugerindo adicionar teste unitário em `/tests/TaskRepository.test.js`."
```

**Justificativas:**

1. **Conhecimento Compartilhado**: Equipe inteira entende mudanças.
2. **Qualidade Garantida**: Outro par valida antes de merge.
3. **Padrões Aplicados**: Consistência enforçada.
4. **Mentoría**: Desenvolvimento contínuo via feedback.

---

### Tratamento de Erros e Logs

**Estrutura de Logs:**

```javascript
// ✅ Bom - Logs estruturados com contexto
class TaskController {
  createTask(req, res) {
    console.log('[INFO] Creating task', { userId: req.userId, title: req.body.title });
    try {
      const task = new Task(Date.now(), req.body.title, false);
      const saved = this.repository.save(task);
      console.log('[DEBUG] Task saved', { taskId: saved.id });
      res.json({ success: true, data: saved });
    } catch (error) {
      console.error('[ERROR] Failed to create task', { userId: req.userId, error: error.message });
      res.status(400).json({ 
        success: false, 
        error: 'Failed to create task. Please check your input.' 
      });
    }
  }
}

// ❌ Ruim - Logs vagos, stack trace exposto
try {
  // ...
} catch (error) {
  console.error(error); // Expõe stack trace interno
  res.status(500).json({ error: error.toString() }); // Mensagem técnica para usuário
}
```

**Níveis de Log:**

| Nível | Uso | Exemplo |
|-------|-----|---------|
| DEBUG | Informações detalhadas para troubleshoot | `Loaded config from file` |
| INFO | Eventos normais | `Task created with ID 123` |
| WARN | Situação incomum mas tolerada | `Retry #3 attempting connection` |
| ERROR | Falha de operação | `Failed to save task: DB error` |

**Mensagens de Erro para Usuário:**

```javascript
// ✅ Bom - Claro e acionável
res.status(400).json({ 
  error: 'Task title is required. Please provide a non-empty title.' 
});

// ❌ Ruim - Técnico, não acionável
res.status(400).json({ 
  error: 'ValidationError: title is required' 
});
```

**Justificativas:**

1. **Debugging Rápido**: Logs estruturados localizamproblemas rapidamente.
2. **Experiência Usuário**: Mensagens claras em vez de stack traces.
3. **Monitoramento**: Logs permitem tracking de padrões de erro.
4. **Rastreabilidade**: Contexto (user, task ID) facilita reprodução.

---

### Versionamento Semântico (SemVer)

**Formato: MAJOR.MINOR.PATCH**

| Segmento | Quando Incrementar | Exemplo |
|----------|-------------------|---------|
| MAJOR | Breaking changes | 1.0.0 → 2.0.0 (muda assinatura de função) |
| MINOR | Novo recurso (backward-compatible) | 1.0.0 → 1.1.0 (novo parâmetro opcional) |
| PATCH | Bug fix | 1.0.0 → 1.0.1 (corrige erro) |

**Exemplos:**

```
1.0.0 — Versão inicial
1.0.1 — Bug fix em criação de tarefa
1.1.0 — Novo recurso: prioridade de tarefas
2.0.0 — Refator: muda estrutura de dados (breaking)
```

**Comunicação em CHANGELOG.md:**

```markdown
## [2.0.0] - 2026-05-20

### Added
- Novo campo `priority` em tarefas (HIGH, MEDIUM, LOW)

### Changed
- **BREAKING**: Estrutura JSON de tarefa mudou; migração necessária

### Fixed
- Bug: tarefas vazias criadas com título em branco
```

**Justificativas:**

1. **Previsibilidade**: Versão comunica impacto de mudança.
2. **Gerenciamento de Dependências**: Consumidores decidem se atualizar.
3. **Compatibilidade**: Clientes sabem se versão nova quebra integração.

---

## Boas Práticas de UX

### Design Responsivo

**Princípios:**

1. **Mobile-First**: Começar com layout móvel, expandir para desktop.
2. **Breakpoints**: Testar em múltiplos tamanhos (320px, 768px, 1024px, 1440px).
3. **Flexibilidade**: Usar Flexbox/Grid, não pixel-perfect layouts.

**Exemplo:**

```html
<!-- ✅ Bom - Responsivo -->
<style>
  .task-list {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    .task-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .task-list {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>

<!-- ❌ Ruim - Fixed width -->
<style>
  .task-list {
    width: 1200px;
    margin: 0 auto;
  }
</style>
```

**Teste em Dispositivos Reais:**

- ✅ Smartphone (iOS Safari, Chrome Android).
- ✅ Tablet (iPad, Android).
- ✅ Desktop (Chrome, Firefox, Safari, Edge).

**Justificativas:**

1. **Mercado**: >50% do tráfego é móvel.
2. **Acessibilidade**: Layouts responsivos melhoram usabilidade geral.
3. **SEO**: Google prioriza sites mobile-friendly.

---

### Acessibilidade (A11y)

**Padrões WCAG 2.1 Nível AA:**

| Prática | Implementação |
|---------|----------------|
| **Contraste** | Mínimo 4.5:1 (texto normal) | Teste com [WebAIM](https://webaim.org/resources/contrastchecker/) |
| **Labels em Formulários** | `<label for="inputId">` + `<input id="inputId">` |
| **Navegação por Teclado** | Tab, Enter, Arrow keys funcionam |
| **ARIA** | `aria-label`, `aria-describedby`, `role` quando semântica HTML insuficiente |
| **Imagens** | `alt` text descritivo ou vazio se decorativa |

**Exemplo:**

```html
<!-- ✅ Bom -->
<label for="task-title">Task Title:</label>
<input 
  id="task-title" 
  type="text" 
  placeholder="Enter task..."
  aria-describedby="title-hint"
>
<p id="title-hint">Max 100 characters</p>

<button aria-label="Mark task as complete">✓</button>

<!-- ❌ Ruim -->
<input type="text" placeholder="Task">
<button>✓</button>
```

**Ferramenta de Teste:**

- Chrome DevTools → Lighthouse → Accessibility
- axe DevTools extension
- NVDA (screenreader gratuito para Windows)

**Justificativas:**

1. **Inclusão**: Acesso para usuários com deficiências (15% população global).
2. **Melhor UX Geral**: Acessibilidade melhora usabilidade para todos.
3. **Legal**: Muitos países exigem A11y para web públicas.

---

### Performance Percebida

**Técnicas:**

1. **Dados Críticos Primeiro**: Carregar dados principais antes de renderizar UI.
2. **Indicadores de Progresso**: Spinner, skeleton loader durante operações.
3. **Operações Não-Bloqueantes**: Usar `async/await`, não congelar UI.

**Exemplo:**

```javascript
// ✅ Bom - Feedback imediato
async function createTask(title) {
  // UI atualiza imediatamente (otimista)
  const tempTask = { id: Math.random(), title, completed: false };
  renderTask(tempTask); // Mostra tarefa temporária

  try {
    const saved = await api.createTask(title);
    updateTask(tempTask.id, saved); // Substitui por versão real
  } catch (error) {
    removeTask(tempTask.id); // Remove se falha
    showError('Failed to create task');
  }
}

// ❌ Ruim - UI congela esperando server
function createTask(title) {
  const saved = api.createTask(title); // Bloqueia até resposta
  renderTask(saved);
}
```

**Métricas:**

- Core Web Vitals (Google):
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

**Justificativas:**

1. **Retenção**: Usuário abandona site se sentir lento.
2. **Conversão**: Performance impacta taxa de conversão (+1s delay = -7% conversão).
3. **SEO**: Google ranking favorece sites rápidos.

---

### Consistência Visual

**Design Tokens:**

Centralizar cores, tipografia, espaçamento em variáveis CSS:

```css
/* ✅ Bom - Tokens centralizados */
:root {
  /* Cores */
  --color-primary: #2563eb;
  --color-secondary: #f3f4f6;
  --color-error: #dc2626;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;

  /* Tipografia */
  --font-family-base: 'Segoe UI', Tahoma, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-weight-normal: 400;
  --font-weight-bold: 600;

  /* Espaçamento */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

/* Uso */
.button {
  background-color: var(--color-primary);
  color: white;
  font-size: var(--font-size-base);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
}

/* ❌ Ruim - Valores hard-coded */
.button {
  background-color: #2563eb;
  color: white;
  font-size: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
}
```

**Componentes Reutilizáveis:**

```html
<!-- ✅ Bom - Biblioteca de componentes -->
<button class="btn btn-primary">Save</button>
<button class="btn btn-secondary">Cancel</button>
<button class="btn btn-small">Delete</button>

<!-- ❌ Ruim - Estilos inline únicos -->
<button style="background: #2563eb; padding: 1rem; border-radius: 0.5rem;">Save</button>
```

**Justificativas:**

1. **Manutenção**: Atualizar tema global em um lugar.
2. **Consistência**: UI uniforme sem duplicação.
3. **Performance**: Menos CSS duplicado.
4. **Escalabilidade**: Adicionar novos componentes rápido.

---

## Boas Práticas de Documentação

### Documentação Técnica

**Estrutura MkDocs:**

```
docs/
├── index.md           # Homepage/Intro
├── architecture.md    # Design de arquitetura
├── practices.md       # (Este arquivo) Padrões e boas práticas
├── run.md            # Como rodar localmente
├── api.md            # Referência de API (se aplicável)
└── troubleshooting.md # Problemas comuns
```

**Conteúdo Mínimo:**

1. **Architecture**: Diagrama MVC, decisões, por que.
2. **Setup**: Pré-requisitos, instalação, verificação.
3. **Guia de Contribuição**: Como adicionar features, padrões a seguir.
4. **API**: Endpoints, payloads, exemplos de resposta.
5. **Troubleshooting**: Problemas comuns e soluções.

**Build e Deploy:**

```bash
# Localmente
mkdocs serve # http://localhost:8000

# Deploy (ex: GitHub Pages)
mkdocs build
```

**Justificativas:**

1. **Onboarding**: Novo dev entende projeto rápido.
2. **Redução de Tickets**: Respostas a perguntas comuns no docs.
3. **Referência**: Decisões históricas documentadas.
4. **Profissionalismo**: Projeto com docs é percebido como maduro.

---

### Comentários no Código

**Regra de Ouro**: Comentários explicam *por quê*, nunca *o quê*.

**O Código já Fala o Quê:**

```javascript
// ❌ Comentário óbvio (ruim)
function getTasks(userId) {
  // Initialize empty array
  const tasks = [];
  // Loop through all tasks
  for (let i = 0; i < this.allTasks.length; i++) {
    // If task belongs to user, add to array
    if (this.allTasks[i].userId === userId) {
      tasks.push(this.allTasks[i]);
    }
  }
  return tasks;
}

// ✅ Código limpo + comentário útil
function getTasks(userId) {
  // Filter tasks by user; O(n) implementation acceptable for <1000 tasks
  // For future: consider indexing by userId if dataset grows
  return this.allTasks.filter(task => task.userId === userId);
}
```

**Quando Comentar:**

1. **Decisões Não-Óbvias**: Trade-offs, por que não alternativa.
2. **Workarounds**: Bug externo, compatibilidade, versão específica.
3. **Complexidade**: Algoritmo não-trivial, lógica obscura.

**Exemplo:**

```javascript
// Workaround: Firefox bug (https://bugzilla.mozilla.org/show_bug.cgi?id=123456)
// addEventListener não funciona em setTimeout, usar requestAnimationFrame
requestAnimationFrame(() => {
  element.addEventListener('click', handler);
});

// Trade-off: Array em memória vs DB
// Escolher memória por: (1) simplicidade, (2) velocidade, (3) sem persistência requerida
// Revisitar se dados crescerem >10MB ou se persistência for necessária
this.tasks = [];
```

**Justificativas:**

1. **Manutenção Futura**: Próximo dev entende contexto.
2. **Reduz Refatorações Erradas**: Evita "melhorias" que quebram workarounds.
3. **Código Legível**: Foco em intenção, não implementação.

---

### Changelog

**Formato: Keep a Changelog**

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.2.0] - 2026-05-15

### Added
- New `priority` field in tasks (HIGH, MEDIUM, LOW)
- Filter tasks by status UI

### Changed
- Updated dependencies: Node 18 → 20
- Improved error messages for validation

### Fixed
- Bug: Tasks disappearing after page refresh
- Bug: Checkbox not updating immediately on click

### Deprecated
- Old `/api/v1/tasks` endpoint (use `/api/v2/tasks`)

### Removed
- Support for Node 16 (EOL)

### Security
- Updated `axios` to patch XSS vulnerability

## [1.1.0] - 2026-05-01

### Added
- Dark mode toggle
- Search by task title

## [1.0.0] - 2026-04-15

### Added
- Initial release: create, read, delete tasks
```

**Manutenção:**

- Atualizar em cada release.
- Usar seções: Added, Changed, Deprecated, Removed, Fixed, Security.
- Incluir links para PRs/issues quando viável.

**Justificativas:**

1. **Comunicação**: Consumidores sabem quais novidades/breaking changes.
2. **Histórico**: Fácil consultar quando feature foi adicionada.
3. **Profissionalismo**: Projeto maduro mantém changelog.

---

## Referência Rápida

| Prática | Checklist |
|---------|-----------|
| **Commits** | Mensagem descritiva, <50 caracteres, use imperative mood (`Add feature`, não `Added feature`) |
| **Branches** | `feature/task-priority`, `bugfix/checkbox-bug`, `docs/api-docs` |
| **PRs** | Pequenas (<400 linhas), descrição clara, testes, lint passa |
| **Releases** | Tag `vX.Y.Z`, atualizar CHANGELOG.md, SemVer |
| **Código** | Lint, SRP, testes, comentários úteis |
| **Docs** | MkDocs build sem erros, links internos funcionam |

---

## Recursos Externos

- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-principles-introduction-to-software-design)
- [Google Style Guides](https://google.github.io/styleguide/)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [MkDocs Documentation](https://www.mkdocs.org/)

---

**Última Atualização**: 2026-05-17
