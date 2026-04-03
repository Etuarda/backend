import { GestaoRepository } from '../../domain/repositories/GestaoRepository';

export class ListSubscriptionsUseCase {
  constructor(private readonly repository: GestaoRepository) {}

  executeByTipo(tipo: string) {
    return this.repository.listAssinaturasByTipo(tipo);
  }

  executeByCliente(codCli: number) {
    return this.repository.listAssinaturasByCliente(codCli);
  }

  executeByPlano(codPlano: number) {
    return this.repository.listAssinaturasByPlano(codPlano);
  }
}
