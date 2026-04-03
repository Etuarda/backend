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

### Com Docker Compose (recomendado)

```bash
docker compose up --build
```

Isso inicia:
- API Gateway na porta `3000`
- Serviço de Gestão na porta `3001`
- Serviço de Faturamento na porta `3002`
- Serviço de Planos Ativos na porta `3003`
- PostgreSQL (semente automática com dados)
- RabbitMQ
- Redis

### Localmente (sem Docker)

1. **Instale as dependências**:
```bash
npm install
cd servico-gestao && npm install && cd ..
cd servico-faturamento && npm install && cd ..
cd servico-planos-ativos && npm install && cd ..
cd api-gateway && npm install && cd ..
```

2. **Configure bancos de dados e mensageria**:
   - PostgreSQL rodando nas portas `5433` (gestão) e `5434` (faturamento)
   - RabbitMQ na porta `5672`
   - Redis na porta `6379`

3. **Inicie cada serviço em um terminal separado**:
```bash
# Terminal 1: Gestão
cd servico-gestao && npm run build && npm start

# Terminal 2: Faturamento
cd servico-faturamento && npm run build && npm start

# Terminal 3: Planos Ativos
cd servico-planos-ativos && npm run build && npm start

# Terminal 4: Gateway
cd api-gateway && npm run build && npm start
```

### Endpoints (via API Gateway)

### Endpoints (via API Gateway)

- `GET http://localhost:3000/gerenciaplanos/clientes` - Lista clientes
- `GET http://localhost:3000/gerenciaplanos/planos` - Lista planos
- `POST http://localhost:3000/gerenciaplanos/assinaturas` - Cria assinatura
- `PATCH http://localhost:3000/gerenciaplanos/planos/:idPlano` - Atualiza custo do plano
- `GET http://localhost:3000/gerenciaplanos/assinaturas/:tipo` - Lista assinaturas por tipo (ATIVOS, TODOS, CANCELADOS)
- `GET http://localhost:3000/gerenciaplanos/asscli/:codcli` - Lista assinaturas por cliente
- `GET http://localhost:3000/gerenciaplanos/assinaturaplano/:codplano` - Lista assinaturas por plano
- `POST http://localhost:3000/registrarpagamento` - Registra pagamento
- `GET http://localhost:3000/planosativos/:codass` - Consulta se assinatura está ativa (com cache)

## Fluxo básico de teste

1. **Listar clientes**: `GET /gerenciaplanos/clientes`
2. **Listar planos**: `GET /gerenciaplanos/planos`
3. **Criar uma assinatura**: `POST /gerenciaplanos/assinaturas` (com `codCli`, `codPlano`, `custoFinal`, `descricao`)
4. **Consultar assinaturas ativas**: `GET /gerenciaplanos/assinaturas/ATIVOS`
5. **Atualizar custo de plano**: `PATCH /gerenciaplanos/planos/1` (com `custoMensal`)
6. **Registrar pagamento**: `POST /registrarpagamento`
7. **Verificar se assinatura está ativa**: `GET /planosativos/:codass`

### Testes automatizados

Use a coleção Postman importando `template.postman_collection.json`:

```bash
newman run template.postman_collection.json
```

## Estrutura de camadas

Cada serviço segue a arquitetura limpa com:

- **domain**: Entidades e interfaces de repositório
- **application**: Casos de uso (Use Cases)
- **infrastructure**: Implementações de banco, cache e mensageria
- **interfaces**: Controllers e rotas HTTP

## Diagramas UML

Arquivos PlantUML em `docs/`:

- `docs/diagrama-componentes.puml`
- `docs/diagrama-classes.puml`

Use `https://editor.plantuml.com/` para gerar imagens a partir desses arquivos.

## Observações

- O banco de gestão é populado automaticamente na inicialização com 10 clientes, 5 planos e 5 assinaturas.
- O serviço de planos ativos invalida o cache quando recebe evento de pagamento.
- O serviço de gestão consome o mesmo evento para atualizar `dataUltimoPagamento`.
