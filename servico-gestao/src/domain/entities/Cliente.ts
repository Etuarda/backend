export type ClienteRecord = {
  codigo: number;
  nome: string;
  email: string;
};

export class Cliente {
  constructor(private readonly data: ClienteRecord) {}

  toJSON() {
    return this.data;
  }
}
