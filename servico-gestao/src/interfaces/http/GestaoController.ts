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
    try {
      const data = await this.listClientesUseCase.execute();
      res.json(data);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  listPlanos = async (_req: Request, res: Response) => {
    try {
      const data = await this.listPlanosUseCase.execute();
      res.json(data);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  createAssinatura = async (req: Request, res: Response) => {
    try {
      const { codCli, codPlano, custoFinal, descricao } = req.body;
      const payload = {
        codCli: Number(codCli),
        codPlano: Number(codPlano),
        custoFinal: Number(custoFinal),
        descricao: String(descricao ?? '').trim(),
      };

      if (!Number.isInteger(payload.codCli) || payload.codCli <= 0) {
        res.status(400).json({ message: 'codCli invalido' });
        return;
      }

      if (!Number.isInteger(payload.codPlano) || payload.codPlano <= 0) {
        res.status(400).json({ message: 'codPlano invalido' });
        return;
      }

      if (!Number.isFinite(payload.custoFinal) || payload.custoFinal <= 0) {
        res.status(400).json({ message: 'custoFinal invalido' });
        return;
      }

      if (!payload.descricao) {
        res.status(400).json({ message: 'descricao obrigatoria' });
        return;
      }

      const data = await this.createSubscriptionUseCase.execute(payload);
      res.status(201).json(data);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  updatePlano = async (req: Request, res: Response) => {
    try {
      const idPlano = Number(req.params.idPlano);
      const custoMensal = Number(req.body.custoMensal);

      if (!Number.isInteger(idPlano) || idPlano <= 0) {
        res.status(400).json({ message: 'idPlano invalido' });
        return;
      }

      if (!Number.isFinite(custoMensal) || custoMensal <= 0) {
        res.status(400).json({ message: 'custoMensal invalido' });
        return;
      }

      const data = await this.updatePlanCostUseCase.execute({ idPlano, custoMensal });

      if (!data) {
        res.status(404).json({ message: 'Plano nao encontrado' });
        return;
      }

      res.json(data);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  listAssinaturasByTipo = async (req: Request, res: Response) => {
    try {
      const data = await this.listSubscriptionsUseCase.executeByTipo(String(req.params.tipo).toUpperCase());
      res.json(data);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  listAssinaturasByCliente = async (req: Request, res: Response) => {
    try {
      const codCli = Number(req.params.codcli);
      if (!Number.isInteger(codCli) || codCli <= 0) {
        res.status(400).json({ message: 'codcli invalido' });
        return;
      }

      const data = await this.listSubscriptionsUseCase.executeByCliente(codCli);
      res.json(data);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  listAssinaturasByPlano = async (req: Request, res: Response) => {
    try {
      const codPlano = Number(req.params.codplano);
      if (!Number.isInteger(codPlano) || codPlano <= 0) {
        res.status(400).json({ message: 'codplano invalido' });
        return;
      }

      const data = await this.listSubscriptionsUseCase.executeByPlano(codPlano);
      res.json(data);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getAssinaturaAtiva = async (req: Request, res: Response) => {
    try {
      const codAss = Number(req.params.codass);
      if (!Number.isInteger(codAss) || codAss <= 0) {
        res.status(400).json({ message: 'codass invalido' });
        return;
      }

      const ativa = await this.getSubscriptionActiveUseCase.execute(codAss);
      res.json({ ativa });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  private handleError(res: Response, error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    res.status(500).json({ message });
  }
}
