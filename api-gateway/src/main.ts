import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const gestaoUrl = process.env.GESTAO_URL ?? 'http://localhost:3001';
const faturamentoUrl = process.env.FATURAMENTO_URL ?? 'http://localhost:3002';
const planosAtivosUrl = process.env.PLANOS_ATIVOS_URL ?? 'http://localhost:3003';

app.use(
  '/gerenciaplanos',
  createProxyMiddleware({
    target: gestaoUrl,
    changeOrigin: true,
    pathRewrite: { '^/gerenciaplanos': '' },
  }),
);

app.use(
  '/registrarpagamento',
  createProxyMiddleware({
    target: faturamentoUrl,
    changeOrigin: true,
  }),
);

app.use(
  '/planosativos',
  createProxyMiddleware({
    target: planosAtivosUrl,
    changeOrigin: true,
  }),
);

app.get('/health', (_req, res) => {
  res.json({ service: 'api-gateway', status: 'ok' });
});

app.listen(port, () => {
  console.log(`api-gateway rodando na porta ${port}`);
});
