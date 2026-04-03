import { Router } from 'express';
import { GestaoController } from './GestaoController';

export function buildRoutes(controller: GestaoController) {
  console.log('building routes');
  const router = Router();

  router.get('/clientes', controller.listClientes);
  router.get('/planos', controller.listPlanos);
  router.post('/assinaturas', controller.createAssinatura);
  router.patch('/planos/:idPlano', controller.updatePlano);
  router.get('/assinaturas/:tipo', controller.listAssinaturasByTipo);
  router.get('/asscli/:codcli', controller.listAssinaturasByCliente);
  router.get('/assinaturaplano/:codplano', controller.listAssinaturasByPlano);
  router.get('/assinaturas/:codass/ativa', controller.getAssinaturaAtiva);

  return router;
}
