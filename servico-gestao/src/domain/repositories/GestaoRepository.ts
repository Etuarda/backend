export interface CreateSubscriptionInput {
  codCli: number;
  codPlano: number;
  custoFinal: number;
  descricao: string;
}

export interface UpdatePlanCostInput {
  idPlano: number;
  custoMensal: number;
}

export interface PaymentEventInput {
  codAss: number;
  dataPagamento: string;
  valorPago: number;
}

export interface GestaoRepository {
  listClientes(): Promise<unknown[]>;
  listPlanos(): Promise<unknown[]>;
  createAssinatura(input: CreateSubscriptionInput): Promise<unknown>;
  updatePlanoCost(input: UpdatePlanCostInput): Promise<unknown>;
  listAssinaturasByTipo(tipo: string): Promise<unknown[]>;
  listAssinaturasByCliente(codCli: number): Promise<unknown[]>;
  listAssinaturasByPlano(codPlano: number): Promise<unknown[]>;
  getAssinaturaAtiva(codAss: number): Promise<boolean>;
  applyPayment(input: PaymentEventInput): Promise<void>;
  initializeSchema(): Promise<void>;
  seed(): Promise<void>;
}
