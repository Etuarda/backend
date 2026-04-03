import { GestaoRepository, UpdatePlanCostInput } from '../../domain/repositories/GestaoRepository';

export class UpdatePlanCostUseCase {
  constructor(private readonly repository: GestaoRepository) {}

  execute(input: UpdatePlanCostInput) {
    return this.repository.updatePlanoCost(input);
  }
}
