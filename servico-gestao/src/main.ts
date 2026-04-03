import express from 'express';
import { env } from './config/env';
import { CreateSubscriptionUseCase } from './application/use-cases/CreateSubscriptionUseCase';
import { GetSubscriptionActiveUseCase } from './application/use-cases/GetSubscriptionActiveUseCase';
import { ListClientesUseCase } from './application/use-cases/ListClientesUseCase';
import { ListPlanosUseCase } from './application/use-cases/ListPlanosUseCase';
import { ListSubscriptionsUseCase } from './application/use-cases/ListSubscriptionsUseCase';
import { RegisterPaymentUseCase } from './application/use-cases/RegisterPaymentUseCase';
import { UpdatePlanCostUseCase } from './application/use-cases/UpdatePlanCostUseCase';
import { startPaymentSubscriber } from './infrastructure/messaging/RabbitSubscriber';
import { connectWithRetry } from './infrastructure/database/PostgresConnection';
import { PostgresGestaoRepository } from './infrastructure/repositories/PostgresGestaoRepository';
import { GestaoController } from './interfaces/http/GestaoController';
import { buildRoutes } from './interfaces/http/routes';

async function bootstrap() {
  await connectWithRetry();
  const repository = new PostgresGestaoRepository();
  await repository.initializeSchema();
  await repository.seed();

  const controller = new GestaoController(
    new ListClientesUseCase(repository),
    new ListPlanosUseCase(repository),
    new CreateSubscriptionUseCase(repository),
    new UpdatePlanCostUseCase(repository),
    new ListSubscriptionsUseCase(repository),
    new GetSubscriptionActiveUseCase(repository),
  );

  await startPaymentSubscriber(new RegisterPaymentUseCase(repository));

  const app = express();
  app.use(express.json());
  app.use(buildRoutes(controller));
  app.get('/health', (_req, res) => res.json({ service: 'servico-gestao', status: 'ok' }));

  app.listen(env.port, () => {
    console.log(`servico-gestao rodando na porta ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
