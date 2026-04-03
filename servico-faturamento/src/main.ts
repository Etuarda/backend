import express from 'express';
import { env } from './config/env';
import { connectWithRetry, pool } from './infrastructure/database/PostgresConnection';
import { getChannel, publishPayment } from './infrastructure/messaging/RabbitPublisher';

async function bootstrap() {
  await connectWithRetry();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pagamentos (
      codigo BIGSERIAL PRIMARY KEY,
      codass BIGINT NOT NULL,
      valorpago NUMERIC(10,2) NOT NULL,
      datapagamento DATE NOT NULL
    );
  `);

  await getChannel();

  const app = express();
  app.use(express.json());

  app.post('/registrarpagamento', async (req, res) => {
    const { codAss, valorPago, dia, mes, ano, dataPagamento } = req.body;
    const effectiveDate = dataPagamento ?? `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    const insert = await pool.query(
      `INSERT INTO pagamentos (codass, valorpago, datapagamento)
       VALUES ($1, $2, $3)
       RETURNING codigo, codass AS "codAss", valorpago AS "valorPago", datapagamento AS "dataPagamento"`,
      [Number(codAss), Number(valorPago), effectiveDate],
    );

    await publishPayment({
      codAss: Number(codAss),
      valorPago: Number(valorPago),
      dataPagamento: effectiveDate,
    });

    res.status(201).json(insert.rows[0]);
  });

  app.get('/health', (_req, res) => res.json({ service: 'servico-faturamento', status: 'ok' }));

  app.listen(env.port, () => {
    console.log(`servico-faturamento rodando na porta ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
