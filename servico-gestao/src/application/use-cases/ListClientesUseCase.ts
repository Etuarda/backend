import { GestaoRepository } from '../../domain/repositories/GestaoRepository';

export class ListClientesUseCase {
  constructor(private readonly repository: GestaoRepository) {}

  execute() {
    return this.repository.listClientes();
  }
}
