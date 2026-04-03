export const env = {
  port: Number(process.env.PORT ?? 3003),
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  rabbitmqUrl: process.env.RABBITMQ_URL ?? 'amqp://localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE ?? 'pagamentos_ex',
  gestaoBaseUrl: process.env.GESTAO_BASE_URL ?? 'http://localhost:3001',
};
