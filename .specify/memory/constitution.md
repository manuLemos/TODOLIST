# Constituição do Projeto TODOLIST

Documento normativo de padrões de projeto e boas práticas de engenharia de software aplicadas ao TODOLIST.

---

## 1. Padrões Arquiteturais

### 1.1 MVC (Model-View-Controller)
**Prática:** Separação obrigatória entre Model, View e Controller.

- **Model**: Definição de entidades de domínio, validações lógicas, repositórios e serviços de negócio.
- **View**: Apresentação visual, componentes UI, camada de renderização.
- **Controller**: Orquestração entre Model e View, validação de entrada, tratamento de requisições e formatação de respostas.

**Justificativa:** Facilita testes isolados, manutenção, substituição de camadas, e compreensão do fluxo de dados.

### 1.2 Mono-Repo
**Prática:** Múltiplos pacotes/aplicações coexistem em um único repositório.

- Scripts de build, testes e CI centralizados.
- Dependências compartilhadas gerenciadas de forma coesiva.
- Estrutura de pastas por domínio ou feature.

**Justificativa:** Facilita reutilização de código, sincronização entre frontend/backend, e manutenção de dependências comuns.

### 1.3 Estrutura de Pastas
**Prática:** Organização previsível e escalável.

```
src/
  ├── api/          # Backend: Controllers, Models, Rotas
  └── web/          # Frontend: Views, Componentes, Assets
docs/               # Documentação gerada com MkDocs
```

**Justificativa:** Nova equipe consegue se orientar rapidamente; reduz overhead cognitivo na localização de código.

---

## 2. Padrões de Código

### 2.1 Naming Conventions
**Prática:** Nomes descritivos, consistentes com a linguagem/comunidade.

- **Arquivos**: `camelCase.js` ou `kebab-case.js` conforme linguagem.
- **Classes/Constructores**: `PascalCase`
- **Funções/Métodos**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Variáveis**: `camelCase`

**Justificativa:** Coesão e previsibilidade; reduz fricção durante code reviews.

### 2.2 Code Style Automatizado
**Prática:** Uso de Prettier, ESLint (ou equivalentes) para formatação e linting automáticos.

- Lint obrigatório em CI/CD.
- Formatação automática em commits (pre-commit hooks).

**Justificativa:** Elimina discussões subjetivas; mantém codebase visualmente consistente; facilita diffs em PRs.

### 2.3 Estrutura de Módulos
**Prática:** Cada módulo com responsabilidade única (SRP - Single Responsibility Principle).

- Funções/classes com propósito claro e bem delimitado.
- Évitar God Objects.
- Exportações explícitas.

**Justificativa:** Facilita testes, compreensão e reutilização.

---

## 3. Boas Práticas de Desenvolvimento

### 3.1 Testes
**Prática:** Cobertura de testes obrigatória para lógica crítica.

- Testes unitários para funções/métodos isolados.
- Testes de integração para fluxos multi-camada.
- Testes e2e para comportamentos críticos do usuário (quando viável).

**Justificativa:** Reduz bugs em produção; facilita refatoração segura; documenta comportamento esperado.

### 3.2 Code Review
**Prática:** Todo código passa por revisão antes de merge.

- PRs pequenas e focadas (máx. 400 linhas/PR quando possível).
- Checklist de revisão: testes, documentação, padrões de código.
- Aprovação de pelo menos 1 reviewer.

**Justificativa:** Dissemina conhecimento; reduz bugs; garante consistência arquitetural.

### 3.3 Tratamento de Erros e Logs
**Prática:** Logs estruturados e mensagens de erro claras e acionáveis.

- Distinguir entre logs de debug, info, warn e error.
- Mensagens de erro devem indicar o que aconteceu e como resolver.
- Evitar stack traces expostos ao usuário final.

**Justificativa:** Facilita debugging; melhora experiência do usuário; reduz tempo de resposta a incidents.

### 3.4 Versionamento Semântico
**Prática:** Seguir SemVer (Major.Minor.Patch).

- MAJOR: breaking changes.
- MINOR: novas features (backward-compatible).
- PATCH: bug fixes.

**Justificativa:** Comunica claramente o impacto de mudanças; facilita gerenciamento de dependências.

---

## 4. Boas Práticas de UX

### 4.1 Design Responsivo
**Prática:** Interface responsiva por padrão para múltiplos tamanhos de tela.

- Mobile-first approach.
- Testes em dispositivos reais ou emuladores.
- Flexbox/Grid para layout.

**Justificativa:** Alcança mais usuários; melhora acessibilidade.

### 4.2 Acessibilidade (A11y)
**Prática:** Interfaces acessíveis por padrão.

- Labels explícitos em formulários.
- Contraste mínimo WCAG AA (4.5:1 para texto).
- Navegação por teclado funcional.
- ARIA labels onde necessário.

**Justificativa:** Inclui usuários com deficiências; frequentemente melhora UX geral.

### 4.3 Performance Percebida
**Prática:** Carregamento rápido e feedback visual imediato.

- Dados críticos carregados antes de renderizar UI.
- Operações assíncronas com spinners/skeleton loaders.
- Evitar jank (stuttering) em interações.

**Justificativa:** Reduz frustração do usuário; melhora retenção.

### 4.4 Consistência Visual
**Prática:** Design tokens e variáveis CSS centralizadas.

- Cores, tipografia, espaçamento e componentes padronizados.
- Ferramenta única de design (ex: design system interno).

**Justificativa:** Facilita manutenção; acelera desenvolvimento; reduz bugs de UI.

---

## 5. Boas Práticas de Documentação

### 5.1 Documentação Técnica
**Prática:** Documentação gerada com MkDocs.

- Estrutura, instalação, como rodar localmente.
- Arquitetura, padrões, decisões técnicas.
- API, exemplos de uso, troubleshooting.

**Justificativa:** Onboarding mais rápido; reduz overhead de perguntas repetidas; facilita manutenção futura.

### 5.2 Comentários no Código
**Prática:** Comentários explicam *por quê*, não *o quê*.

- Evitar comentários óbvios.
- Documentar decisões não-óbvias, trade-offs, e workarounds.

**Justificativa:** Código limpo já fala o quê; comentários agregam valor ao explicar intenção.

### 5.3 Changelog
**Prática:** Manter CHANGELOG.md atualizado.

- Listar breaking changes, novidades e bug fixes em cada versão.
- Seguir Keep a Changelog format.

**Justificativa:** Facilita comunicação com usuários/dependentes; histórico claro de evolução.

---

## Referência Cruzada

Para detalhes, justificativas e exemplos práticos de cada prática, consulte [Práticas e Padrões](../docs/practices.md).

**Versão**: 2.0.0 | **Ratificado**: 2026-05-17 | **Última Emenda**: 2026-05-17
