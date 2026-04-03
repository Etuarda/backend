import amqp from 'amqplib';
import { env } from '../../config/env';
import { redisClient } from '../cache/redisClient';

export async function startSubscriber() {
  let retries = 0;

  while (retries < 20) {
    try {
      const connection = await amqp.connect(env.rabbitmqUrl);
      const channel = await connection.createChannel();
      await channel.assertExchange(env.exchange, 'fanout', { durable: true });
      const queue = await channel.assertQueue('planos_ativos_pagamentos_queue', { durable: true });
      await channel.bindQueue(queue.queue, env.exchange, '');

      channel.consume(queue.queue, async (message: any) => {
        if (!message) return;
        try {
          const payload = JSON.parse(message.content.toString()) as { codAss: number };
          await redisClient.del(`assinatura:${payload.codAss}`);
          channel.ack(message);
        } catch (error) {
          console.error('Erro ao invalidar cache no servico-planos-ativos:', error);
          channel.nack(message, false, false);
        }
      });

      console.log('servico-planos-ativos consumindo eventos de pagamento');
      return;
    } catch (error) {
      retries += 1;
      console.log(`Aguardando RabbitMQ no servico-planos-ativos... tentativa ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  throw new Error('Nao foi possivel conectar ao RabbitMQ no servico-planos-ativos');
}
