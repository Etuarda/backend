import { Assinatura } from './Assinatura';

describe('Assinatura', () => {
  test('estaAtiva deve retornar true quando dentro de fidelidade e pagamento recente', () => {
    const today = new Date();
    const data = {
      codigo: 1,
      codplano: 1,
      codcli: 1,
      iniciofidelidade: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10).toISOString().split('T')[0],
      fimfidelidade: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 300).toISOString().split('T')[0],
      dataultimopagamento: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5).toISOString().split('T')[0],
      custofinal: 50,
      descricao: 'teste',
    };

    expect(new Assinatura(data).estaAtiva(today)).toBe(true);
  });

  test('estaAtiva deve retornar false quando fora do periodo de fidelidade', () => {
    const yesterday = new Date();
    const data = {
      codigo: 1,
      codplano: 1,
      codcli: 1,
      iniciofidelidade: '2020-01-01',
      fimfidelidade: '2020-12-31',
      dataultimopagamento: '2020-12-01',
      custofinal: 50,
      descricao: 'teste',
    };

    expect(new Assinatura(data).estaAtiva(yesterday)).toBe(false);
  });

  test('estaAtiva deve retornar false quando pagamento anterior a 30 dias', () => {
    const today = new Date();
    const data = {
      codigo: 1,
      codplano: 1,
      codcli: 1,
      iniciofidelidade: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 100).toISOString().split('T')[0],
      fimfidelidade: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 200).toISOString().split('T')[0],
      dataultimopagamento: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 40).toISOString().split('T')[0],
      custofinal: 50,
      descricao: 'teste',
    };

    expect(new Assinatura(data).estaAtiva(today)).toBe(false);
  });
});
