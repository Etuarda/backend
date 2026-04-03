import amqp from 'amqplib';
import { env } from '../../config/env';

let channel: any = null;
let connection: any = null;

export async function getChannel(): Promise<any> {
  if (channel) return channel;

  let retries = 0;
  while (retries < 20) {
    try {
      connection = await amqp.connect(env.rabbitmqUrl);
      channel = await connection.createChannel();
      await channel.assertExchange(env.exchange, 'fanout', { durable: true });
      return channel;
    } catch (error) {
      retries += 1;
      console.log(`Aguardando RabbitMQ no servico-faturamento... tentativa ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  throw new Error('Nao foi possivel conectar ao RabbitMQ no servico-faturamento');
}

export async function publishPayment(payload: unknown) {
  const activeChannel = await getChannel();
  activeChannel.publish(env.exchange, '', Buffer.from(JSON.stringify(payload)), { durable: true });
}
