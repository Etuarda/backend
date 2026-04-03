import { GestaoRepository } from '../../domain/repositories/GestaoRepository';

export class GetSubscriptionActiveUseCase {
  constructor(private readonly repository: GestaoRepository) {}

  execute(codAss: number) {
    return this.repository.getAssinaturaAtiva(codAss);
  }
}
