# Sistema de Controle de Planos de Operadora

Projeto backend estruturado em serviços independentes para gestão de clientes, planos, assinaturas, faturamento e consulta de planos ativos.

## Estrutura

- `servico-gestao`: serviço principal com foco em clientes, planos e assinaturas
- `servico-faturamento`: registra pagamentos e publica eventos
- `servico-planos-ativos`: consulta rápida de assinaturas ativas com cache
- `api-gateway`: centraliza o acesso HTTP aos serviços internos

## Stack

- Node.js 22
- TypeScript
- Express
- PostgreSQL
- RabbitMQ
- Redis
- Docker Compose

## Observação sobre rotas

As rotas do serviço de gestão são expostas externamente pelo API Gateway com o prefixo `/gerenciaplanos`. No enunciado, os endpoints do serviço principal aparecem com o prefixo `/gestao`; nesta implementação, a diferença está apenas no ponto de entrada externo definido pelo gateway. As responsabilidades funcionais permanecem as mesmas: listagem de clientes e planos, criação de assinaturas, atualização de plano e consultas de assinaturas. Essa decisão foi adotada para centralizar o acesso ao serviço principal e manter desacoplada a comunicação entre cliente e serviços internos.

## Como executar

### Com Docker Compose

```bash
docker compose up --build
```

Isso inicia:

- API Gateway na porta `3000`
- ServicoGestao na porta `3001`
- ServicoFaturamento na porta `3002`
- ServicoPlanosAtivos na porta `3003`
- PostgreSQL de gestão
- PostgreSQL de faturamento
- RabbitMQ
- Redis

### Localmente (sem Docker)

1. Instale as dependências:

```bash
npm install
cd servico-gestao
npm install
cd ..
cd servico-faturamento
npm install
cd ..
cd servico-planos-ativos
npm install
cd ..
cd api-gateway
npm install
cd ..
```

2. Garanta a execução local de:

- PostgreSQL para gestão na porta `5433`, com banco `operadora_gestao` e credenciais `postgres/postgres`
- PostgreSQL para faturamento na porta `5434`, com banco `operadora_faturamento` e credenciais `postgres/postgres`
- RabbitMQ na porta `5672`
- Redis na porta `6379`

3. Inicie cada serviço em um terminal:

```bash
cd servico-gestao && npm run build && npm start
cd servico-faturamento && npm run build && npm start
cd servico-planos-ativos && npm run build && npm start
cd api-gateway && npm run build && npm start
```

## Endpoints via API Gateway

- `GET http://localhost:3000/gerenciaplanos/clientes`
- `GET http://localhost:3000/gerenciaplanos/planos`
- `POST http://localhost:3000/gerenciaplanos/assinaturas`
- `PATCH http://localhost:3000/gerenciaplanos/planos/:idPlano`
- `GET http://localhost:3000/gerenciaplanos/assinaturas/:tipo`
- `GET http://localhost:3000/gerenciaplanos/asscli/:codcli`
- `GET http://localhost:3000/gerenciaplanos/assinaturaplano/:codplano`
- `POST http://localhost:3000/registrarpagamento`
- `GET http://localhost:3000/planosativos/:codass`

Observação:

- o endpoint `asscli` corresponde à consulta de assinaturas por cliente
- o endpoint `assinaturaplano` corresponde à consulta de assinaturas por plano

## Fluxo básico de teste

1. Listar clientes
2. Listar planos
3. Criar assinatura
4. Consultar assinaturas por tipo
5. Atualizar custo do plano
6. Registrar pagamento
7. Verificar se a assinatura permanece ativa

## Testes automatizados

Use a coleção Postman:

```bash
npx newman run eduarda_silva_santos_Desenvolvimento_de_Sistemas_backend_Fase-2.postman_collection.json
```

## Estrutura de camadas

- `domain`: entidades e contratos
- `application`: casos de uso
- `infrastructure`: persistência, mensageria e cache
- `interfaces`: controllers e rotas

## Observações

- O banco de gestão é populado automaticamente com 10 clientes, 5 planos e 5 assinaturas.
- O serviço de gestão consome eventos de pagamento e atualiza `dataUltimoPagamento`.
- O serviço de planos ativos invalida o cache ao receber evento de pagamento.
