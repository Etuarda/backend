export const env = {
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5433/operadora_gestao',
  rabbitmqUrl: process.env.RABBITMQ_URL ?? 'amqp://localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE ?? 'pagamentos_ex',
};
