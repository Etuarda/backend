import amqp from 'amqplib';
import { env } from '../../config/env';
import { RegisterPaymentUseCase } from '../../application/use-cases/RegisterPaymentUseCase';

export async function startPaymentSubscriber(registerPaymentUseCase: RegisterPaymentUseCase) {
  let retries = 0;

  while (retries < 20) {
    try {
      const connection = await amqp.connect(env.rabbitmqUrl);
      const channel = await connection.createChannel();
      await channel.assertExchange(env.exchange, 'fanout', { durable: true });
      const queue = await channel.assertQueue('gestao_pagamentos_queue', { durable: true });
      await channel.bindQueue(queue.queue, env.exchange, '');

      channel.consume(queue.queue, async (message: any) => {
        if (!message) return;

        try {
          const payload = JSON.parse(message.content.toString()) as {
            codAss: number;
            valorPago: number;
            dataPagamento: string;
          };

          await registerPaymentUseCase.execute(payload);
          channel.ack(message);
        } catch (error) {
          console.error('Erro ao processar evento no servico-gestao:', error);
          channel.nack(message, false, false);
        }
      });

      console.log('servico-gestao consumindo eventos de pagamento');
      return;
    } catch (error) {
      retries += 1;
      console.log(`Aguardando RabbitMQ no servico-gestao... tentativa ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  throw new Error('Nao foi possivel conectar ao RabbitMQ no servico-gestao');
}
