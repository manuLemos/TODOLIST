# Feature: TODO-LIST com Lembretes

Visão geral

Implementar uma lista de tarefas (TODO) com suporte a lembretes. A aplicação segue arquitetura MVC e política de repositório mono-repo. Dados são mantidos em memória (sem banco persistente).

User Stories

- Como usuário, quero cadastrar uma tarefa com título e data/hora de lembrete.
- Como usuário, quero visualizar todas as minhas tarefas em uma lista clara.
- Como usuário, quero remover tarefas que já foram concluídas ou canceladas.
- Como usuário, quero que o sistema destaque tarefas que possuem lembretes próximos.

Escopo

- CRUD mínimo para tarefas: criar, listar, atualizar (status), remover.
- Atributos principais: id, título, descrição opcional, reminder_at (data/hora), created_at, status (pending/completed/cancelled).
- Interface de listagem com destaque visual para lembretes próximos (threshold configurável, padrão: 24 horas).
- Persistência em memória durante a execução; export/import para persistência externa fora do escopo.

Regras e Comportamento

- Criação: título obrigatório; reminder_at opcional, se presente deve ser uma data/hora futura.
- Listagem: ordenar por estado (pendentes primeiro) e depois por reminder_at asc; tasks sem reminder aparecem no final.
- Remoção: permitido remover tarefas com status completed ou cancelled; remoção permanente em memória.
- Marcação de concluída: permite marcar completed; ao marcar, task pode ser removida via ação de usuário.
- Destaque de lembrete próximo: definir threshold (configurável) em horas; por padrão highlight quando reminder_at estiver dentro das próximas 24 horas a partir do tempo atual.

Acceptância (Critérios de Aceitação)

1. Criar tarefa com título e reminder
   - Dado que eu envio título válido e reminder_at válido no futuro
   - Quando eu submeter o formulário de criação
   - Então a tarefa é criada em memória com status pending e aparece na listagem

2. Visualizar lista de tarefas
   - Dado que existam tarefas
   - Quando eu abrir a tela de listagem
   - Então vejo todas as tarefas ordenadas conforme regra e com destaque nas que têm lembretes próximos

3. Remover tarefa concluída
   - Dado uma tarefa marcada como completed
   - Quando eu acionar a ação "Remover"
   - Então a tarefa é removida da memória e não aparece mais na listagem

4. Destaque de lembrete próximo
   - Dado uma tarefa com reminder_at dentro de 24 horas
   - Quando a lista for renderizada
   - Então a tarefa recebe um estilo/label de destaque (ex: "Lembrete Próximo")

Model (Model)

Task {
  id: string (UUID)
  title: string
  description?: string
  reminder_at?: ISO-8601 datetime
  created_at: ISO-8601 datetime
  status: enum('pending','completed','cancelled')
}

Controller (API / Controllers)

- POST /tasks
  - Body: { title, description?, reminder_at? }
  - Validações: title não vazio; reminder_at > now se fornecido
  - Retorna 201 com task criada

- GET /tasks
  - Query: ?status&?highlight_threshold_hours (opcional)
  - Retorna lista de tasks ordenadas conforme regra e sinaliza highlight

- PATCH /tasks/:id/status
  - Body: { status }
  - Validações: status válido
  - Retorna 200 com task atualizada

- DELETE /tasks/:id
  - Somente remove se status in ['completed','cancelled']
  - Retorna 204 se removido, 400/404 caso contrário

View (UI)

- Tela de criação rápida com título e campo datetime para lembrete.
- Listagem com linhas mostrando título, horário do lembrete (se houver), status e ações (concluir, cancelar, remover quando aplicável).
- Destaque visual (badge e cor) para lembretes próximos; tooltip com tempo restante.
- Interface responsiva e minimalista; não usar fonte Gochi Hand.

Testes

- Unitários: modelo (validations), controller (routes e validações), util de destaque (cálculo de threshold).
- Integração: criação → listagem → marcar completed → remoção.
- Tests devem rodar em CI e manter comportamento determinístico (usar injeção de tempo nas funções que dependem de now).

Considerações de Implementação

- Armazenamento: repositório em memória (mapa ou lista) exposto via interface para facilitar substituição futura.
- Highlight: função util calculateIsHighlight(reminder_at, now, thresholdHours) que retorna boolean.
- Timezone: todas as datas em UTC internamente; UI converte para timezone local do usuário para exibição.
- Export/Import: fornecer endpoints ou util para exportar snapshot JSON (fora do escopo de persistência automática).

Observabilidade

- Logar criação, atualização, remoção com id e payload (logs estruturados).
- Contabilizar métricas: tasks.created, tasks.completed, tasks.removed.

Notas

- Compatível com MVC e mono-repo exigidos na Constituição do projeto.
- Restrições: não usar banco persistente; documentar implementação no MkDocs.

Todos os pontos acima servem como especificação mínima para a entrega da feature "TODO-LIST com Lembretes". Ajustes podem ser aplicados por PR com referência a esta especificação.
