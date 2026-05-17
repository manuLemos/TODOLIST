# TODOLIST

Projeto TODO com lembretes — arquitetura MVC, mono-repo, dados em memória.

Pré-requisitos

- Node.js 18+ e npm
- Python 3.x e pip (para MkDocs)

Scripts úteis

- Instalar dependências na raiz (quando houver workspaces):

  npm install

- Rodar API:

  cd src/api && npm install && npm start

- Rodar frontend (servir estático):

  cd src/web && npm install && npm start

- Rodar documentação localmente:

  mkdocs serve

[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://manulemos.github.io/TODOLIST/)

Arquitetura e decisões

- MVC obrigatório e mono-repo facilitam separação de responsabilidades e manutenção.
- Dados mantidos em memória por restrição do projeto; export/import externo para persistência.
- Documentação em MkDocs conforme constituição.
