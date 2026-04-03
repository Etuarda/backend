export type AssinaturaRecord = {
  codigo: number;
  codplano: number;
  codcli: number;
  iniciofidelidade: string;
  fimfidelidade: string;
  dataultimopagamento: string | null;
  custofinal: number;
  descricao: string;
};

export class Assinatura {
  constructor(private readonly data: AssinaturaRecord) {}

  toJSON() {
    return this.data;
  }

  estaAtiva(referenceDate = new Date()): boolean {
    const fim = new Date(this.data.fimfidelidade);
    const ultimoPagamento = this.data.dataultimopagamento
      ? new Date(this.data.dataultimopagamento)
      : null;

    const withinFidelity = fim >= referenceDate;
    const withinPaymentWindow = ultimoPagamento
      ? differenceInDays(referenceDate, ultimoPagamento) <= 30
      : false;

    return withinFidelity && withinPaymentWindow;
  }
}

function differenceInDays(a: Date, b: Date): number {
  const millis = Math.abs(a.getTime() - b.getTime());
  return Math.floor(millis / (1000 * 60 * 60 * 24));
}
