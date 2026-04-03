import { GestaoRepository, PaymentEventInput } from '../../domain/repositories/GestaoRepository';

export class RegisterPaymentUseCase {
  constructor(private readonly repository: GestaoRepository) {}

  execute(input: PaymentEventInput) {
    return this.repository.applyPayment(input);
  }
}
