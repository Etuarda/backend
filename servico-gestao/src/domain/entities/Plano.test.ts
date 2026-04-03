import { Plano } from './Plano';

describe('Plano', () => {
  test('toJSON devolve objeto correto', () => {
    const plano = new Plano({ codigo: 10, nome: 'Fibra 100MB', custoMensal: 123.45, data: '2026-04-02', descricao: 'Teste' });
    expect(plano.toJSON()).toEqual({ codigo: 10, nome: 'Fibra 100MB', custoMensal: 123.45, data: '2026-04-02', descricao: 'Teste' });
  });
});
