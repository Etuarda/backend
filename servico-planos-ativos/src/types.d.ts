declare module 'amqplib' {
  export interface Connection {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
  }
  export interface Channel {
    assertExchange(exchange: string, type: string, options?: any): Promise<void>;
    assertQueue(queue: string, options?: any): Promise<{ queue: string }>;
    bindQueue(queue: string, exchange: string, routingKey: string): Promise<void>;
    consume(queue: string, callback: (message: ConsumeMessage | null) => void, options?: any): Promise<{ consumerTag: string }>;
    ack(message: ConsumeMessage): void;
    nack(message: ConsumeMessage, multiple?: boolean, requeue?: boolean): void;
    close(): Promise<void>;
  }
  export interface ConsumeMessage {
    content: Buffer;
  }
  export function connect(url: string): Promise<Connection>;
}