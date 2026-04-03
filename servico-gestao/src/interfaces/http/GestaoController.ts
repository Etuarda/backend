import { Request, Response } from 'express';
import { CreateSubscriptionUseCase } from '../../application/use-cases/CreateSubscriptionUseCase';
import { GetSubscriptionActiveUseCase } from '../../application/use-cases/GetSubscriptionActiveUseCase';
import { ListClientesUseCase } from '../../application/use-cases/ListClientesUseCase';
import { ListPlanosUseCase } from '../../application/use-cases/ListPlanosUseCase';
import { ListSubscriptionsUseCase } from '../../application/use-cases/ListSubscriptionsUseCase';
import { UpdatePlanCostUseCase } from '../../application/use-cases/UpdatePlanCostUseCase';

export class GestaoController {
  constructor(
    private readonly listClientesUseCase: ListClientesUseCase,
    private readonly listPlanosUseCase: ListPlanosUseCase,
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly updatePlanCostUseCase: UpdatePlanCostUseCase,
    private readonly listSubscriptionsUseCase: ListSubscriptionsUseCase,
    private readonly getSubscriptionActiveUseCase: GetSubscriptionActiveUseCase,
  ) {}

  listClientes = async (_req: Request, res: Response) => {
    console.log('listClientes called');
    const data = await this.listClientesUseCase.execute();
    res.json(data);
  };

  listPlanos = async (_req: Request, res: Response) => {
    const data = await this.listPlanosUseCase.execute();
    res.json(data);
  };

  createAssinatura = async (req: Request, res: Response) => {
    const { codCli, codPlano, custoFinal, descricao } = req.body;
    const data = await this.createSubscriptionUseCase.execute({
      codCli: Number(codCli),
      codPlano: Number(codPlano),
      custoFinal: Number(custoFinal),
      descricao: String(descricao),
    });
    res.status(201).json(data);
  };

  updatePlano = async (req: Request, res: Response) => {
    const data = await this.updatePlanCostUseCase.execute({
      idPlano: Number(req.params.idPlano),
      custoMensal: Number(req.body.custoMensal),
    });

    if (!data) {
      res.status(404).json({ message: 'Plano nao encontrado' });
      return;
    }

    res.json(data);
  };

  listAssinaturasByTipo = async (req: Request, res: Response) => {
    const data = await this.listSubscriptionsUseCase.executeByTipo(String(req.params.tipo).toUpperCase());
    res.json(data);
  };

  listAssinaturasByCliente = async (req: Request, res: Response) => {
    const data = await this.listSubscriptionsUseCase.executeByCliente(Number(req.params.codcli));
    res.json(data);
  };

  listAssinaturasByPlano = async (req: Request, res: Response) => {
    const data = await this.listSubscriptionsUseCase.executeByPlano(Number(req.params.codplano));
    res.json(data);
  };

  getAssinaturaAtiva = async (req: Request, res: Response) => {
    const ativa = await this.getSubscriptionActiveUseCase.execute(Number(req.params.codass));
    res.json({ ativa });
  };
}
