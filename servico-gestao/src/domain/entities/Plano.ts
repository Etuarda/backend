export type PlanoRecord = {
  codigo: number;
  nome: string;
  custoMensal: number;
  data: string;
  descricao: string;
};

export class Plano {
  constructor(private readonly data: PlanoRecord) {}

  toJSON() {
    return this.data;
  }
}
