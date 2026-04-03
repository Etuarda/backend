import { Cliente } from './Cliente';

describe('Cliente', () => {
  test('toJSON devolve objeto correto', () => {
    const cliente = new Cliente({ codigo: 1, nome: 'Maria', email: 'maria@example.com' });
    expect(cliente.toJSON()).toEqual({ codigo: 1, nome: 'Maria', email: 'maria@example.com' });
  });
});
