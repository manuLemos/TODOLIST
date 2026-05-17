# Tasks: Implementar feature TODO-LIST com Lembretes

Requisito principal: Gerar lista de tarefas ordenadas e entregar pipeline, documentação e front/back básicos.

Tarefas:

1. Configurar estrutura Mono-repo e MkDocs inicial
   - Criar `package.json` raiz com workspaces
   - Criar `mkdocs.yml` e `docs/index.md`

2. Criar Model e Mock de dados em memória
   - Implementar repositório em memória em `packages/api/index.js`
   - Fornecer mock inicial com algumas tasks

3. Implementar métodos CRUD (Create, Read, Delete)
   - Endpoints: POST /tasks, GET /tasks, DELETE /tasks/:id
   - Validações: título obrigatório; remoção apenas se status completed/cancelled

4. Criar View Index com formulário e listagem
   - `packages/web/index.html`, `app.js`, `style.css`
   - Formulário para criar task e listagem com destaque de lembretes próximos

5. Configurar pipeline de deploy para servidor gratuito (GitHub Pages)
   - Workflow em `.github/workflows/deploy.yml` que gera site MkDocs e copia frontend para `site/` e publica

6. Documentação (MkDocs)
   - Documentar endpoints, modelo e instruções para rodar localmente em `docs/`

Observações:
- Respeitar a Constituição: MVC, mono-repo, sem banco persistente, MkDocs obrigatória.
- Testes e CI podem ser adicionados em PRs seguintes.
