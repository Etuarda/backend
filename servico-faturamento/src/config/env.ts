export const env = {
  port: Number(process.env.PORT ?? 3002),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5434/operadora_faturamento',
  rabbitmqUrl: process.env.RABBITMQ_URL ?? 'amqp://localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE ?? 'pagamentos_ex',
};
