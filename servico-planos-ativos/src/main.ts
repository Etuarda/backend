import axios from 'axios';
import express from 'express';
import { env } from './config/env';
import { redisClient } from './infrastructure/cache/redisClient';
import { startSubscriber } from './infrastructure/messaging/RabbitSubscriber';

async function bootstrap() {
  await redisClient.connect();
  await startSubscriber();

  const app = express();

  app.get('/planosativos/:codass', async (req, res) => {
    const codAss = Number(req.params.codass);
    const key = `assinatura:${codAss}`;
    const cached = await redisClient.get(key);

    if (cached !== null) {
      res.json(JSON.parse(cached));
      return;
    }

    const response = await axios.get(`${env.gestaoBaseUrl}/assinaturas/${codAss}/ativa`);
    const payload = { ativa: Boolean(response.data.ativa) };

    await redisClient.set(key, JSON.stringify(payload), { EX: 600 });
    res.json(payload);
  });

  app.get('/health', (_req, res) => res.json({ service: 'servico-planos-ativos', status: 'ok' }));

  app.listen(env.port, () => {
    console.log(`servico-planos-ativos rodando na porta ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
