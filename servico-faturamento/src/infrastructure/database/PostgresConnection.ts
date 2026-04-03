import { Pool } from 'pg';
import { env } from '../../config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export async function connectWithRetry(maxRetries = 20, delayMs = 3000): Promise<void> {
  let retries = 0;
  while (true) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (error) {
      retries += 1;
      if (retries >= maxRetries) {
        throw new Error(`Falha ao conectar ao banco de dados apos ${retries} tentativas: ${error}`);
      }
      console.log(`Aguardando banco de dados servico-faturamento (${retries}/${maxRetries})...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
