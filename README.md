# Sistema de Controle de Planos de Operadora

Projeto backend estruturado em serviços independentes para gestão de clientes, planos, assinaturas, faturamento e consulta de planos ativos.

## Estrutura

- `servico-gestao`: serviço principal com foco em clientes, planos e assinaturas
- `servico-faturamento`: registra pagamentos e publica eventos no RabbitMQ
- `servico-planos-ativos`: consulta rápida de assinaturas ativas com Redis
- `api-gateway`: centraliza o acesso HTTP aos serviços internos
- `postman`: coleção para testes manuais
- `docs`: documentação de apoio e diagramas em PlantUML

## Stack

- Node.js 22
- TypeScript
- Express
- PostgreSQL
- RabbitMQ
- Redis
- Docker Compose

## Como executar

### Opção recomendada

```bash
docker compose up --build
```

### Endpoints expostos pelo gateway

- `http://localhost:3000/gestao/clientes`
- `http://localhost:3000/gestao/planos`
- `http://localhost:3000/gestao/assinaturas`
- `http://localhost:3000/gestao/planos/:idPlano`
- `http://localhost:3000/gestao/assinaturas/:tipo`
- `http://localhost:3000/gestao/assinaturascliente/:codcli`
- `http://localhost:3000/gestao/assinaturasplano/:codplano`
- `http://localhost:3000/registrarpagamento`
- `http://localhost:3000/planosativos/:codass`

## Fluxo básico de teste

1. Listar clientes.
2. Listar planos.
3. Criar uma assinatura.
4. Consultar assinaturas por tipo.
5. Atualizar custo de plano.
6. Registrar pagamento.
7. Consultar se a assinatura está ativa via `planosativos`.

## Endpoint extra documentado

- `GET /gestao/assinaturas/:codass/ativa` (Serviço de gestão): retorna `{ ativa: true | false }` para assinatura especificada.
- `GET /planosativos/:codass` (serviço de cache): retorna igualmente a validação com cache.

## Diagramas UML

Arquivos PlantUML em `docs/`:

- `docs/diagrama-componentes.puml`
- `docs/diagrama-classes.puml`

Use `https://editor.plantuml.com/` para gerar imagens a partir desses arquivos.

## Observações

- O banco de gestão é populado automaticamente na inicialização com 10 clientes, 5 planos e 5 assinaturas.
- O serviço de planos ativos invalida o cache quando recebe evento de pagamento.
- O serviço de gestão consome o mesmo evento para atualizar `dataUltimoPagamento`.
