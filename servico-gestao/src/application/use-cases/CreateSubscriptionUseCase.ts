import { CreateSubscriptionInput, GestaoRepository } from '../../domain/repositories/GestaoRepository';

export class CreateSubscriptionUseCase {
  constructor(private readonly repository: GestaoRepository) {}

  execute(input: CreateSubscriptionInput) {
    return this.repository.createAssinatura(input);
  }
}
