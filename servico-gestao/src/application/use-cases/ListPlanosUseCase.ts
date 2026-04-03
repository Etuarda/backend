import { GestaoRepository } from '../../domain/repositories/GestaoRepository';

export class ListPlanosUseCase {
  constructor(private readonly repository: GestaoRepository) {}

  execute() {
    return this.repository.listPlanos();
  }
}
