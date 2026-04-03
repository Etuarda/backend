import { pool } from '../database/PostgresConnection';
import { Assinatura } from '../../domain/entities/Assinatura';
import { Cliente } from '../../domain/entities/Cliente';
import { Plano } from '../../domain/entities/Plano';
import {
  CreateSubscriptionInput,
  GestaoRepository,
  PaymentEventInput,
  UpdatePlanCostInput,
} from '../../domain/repositories/GestaoRepository';

export class PostgresGestaoRepository implements GestaoRepository {
  async initializeSchema(): Promise<void> {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        codigo BIGSERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS planos (
        codigo BIGSERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        custoMensal NUMERIC(10,2) NOT NULL,
        data DATE NOT NULL,
        descricao TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS assinaturas (
        codigo BIGSERIAL PRIMARY KEY,
        codplano BIGINT NOT NULL REFERENCES planos(codigo),
        codcli BIGINT NOT NULL REFERENCES clientes(codigo),
        iniciofidelidade DATE NOT NULL,
        fimfidelidade DATE NOT NULL,
        dataultimopagamento DATE,
        custofinal NUMERIC(10,2) NOT NULL,
        descricao TEXT NOT NULL
      );
    `);
  }

  async seed(): Promise<void> {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM clientes');
    if (rows[0].total > 0) return;

    await pool.query(`
      INSERT INTO clientes (nome, email) VALUES
      ('Ana Clara', 'ana@email.com'),
      ('Bruno Lima', 'bruno@email.com'),
      ('Carla Souza', 'carla@email.com'),
      ('Daniel Costa', 'daniel@email.com'),
      ('Erika Rocha', 'erika@email.com'),
      ('Felipe Gomes', 'felipe@email.com'),
      ('Gabriela Melo', 'gabriela@email.com'),
      ('Henrique Alves', 'henrique@email.com'),
      ('Isabela Martins', 'isabela@email.com'),
      ('Joao Pedro', 'joao@email.com');

      INSERT INTO planos (nome, custoMensal, data, descricao) VALUES
      ('Fibra 200MB', 89.90, CURRENT_DATE, 'Internet fibra com 200MB'),
      ('Fibra 400MB', 109.90, CURRENT_DATE, 'Internet fibra com 400MB'),
      ('Fibra 600MB', 149.90, CURRENT_DATE, 'Internet fibra com 600MB'),
      ('Combo TV + Internet', 199.90, CURRENT_DATE, 'Internet e TV inclusa'),
      ('Empresarial Pro', 299.90, CURRENT_DATE, 'Plano empresarial com suporte prioritario');

      INSERT INTO assinaturas (codplano, codcli, iniciofidelidade, fimfidelidade, dataultimopagamento, custofinal, descricao) VALUES
      (1, 1, CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', CURRENT_DATE - INTERVAL '10 days', 79.90, 'Desconto promocional de fidelidade'),
      (2, 2, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days', CURRENT_DATE - INTERVAL '5 days', 99.90, 'Campanha de entrada'),
      (3, 3, CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE + INTERVAL '245 days', CURRENT_DATE - INTERVAL '20 days', 129.90, 'Plano com desconto de retencao'),
      (4, 4, CURRENT_DATE - INTERVAL '400 days', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '40 days', 199.90, 'Assinatura expirada'),
      (5, 5, CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '305 days', CURRENT_DATE - INTERVAL '2 days', 279.90, 'Plano empresarial promocional');
    `);
  }

  async listClientes() {
    const { rows } = await pool.query('SELECT codigo, nome, email FROM clientes ORDER BY codigo');
    return rows.map((row) => new Cliente(row).toJSON());
  }

  async listPlanos() {
    const { rows } = await pool.query('SELECT codigo, nome, custoMensal, data, descricao FROM planos ORDER BY codigo');
    return rows.map((row) => new Plano(row).toJSON());
  }

  async createAssinatura(input: CreateSubscriptionInput) {
    const query = `
      INSERT INTO assinaturas (
        codplano,
        codcli,
        iniciofidelidade,
        fimfidelidade,
        dataultimopagamento,
        custofinal,
        descricao
      ) VALUES (
        $1,
        $2,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '365 days',
        CURRENT_DATE,
        $3,
        $4
      )
      RETURNING codigo, codplano AS "codPlano", codcli AS "codCli", iniciofidelidade AS "inicioFidelidade", fimfidelidade AS "fimFidelidade", dataultimopagamento AS "dataUltimoPagamento", custofinal AS "custoFinal", descricao;
    `;

    const { rows } = await pool.query(query, [input.codPlano, input.codCli, input.custoFinal, input.descricao]);
    return rows[0];
  }

  async updatePlanoCost(input: UpdatePlanCostInput) {
    const query = `
      UPDATE planos
      SET custoMensal = $2,
          data = CURRENT_DATE
      WHERE codigo = $1
      RETURNING codigo, nome, custoMensal, data, descricao;
    `;

    const { rows } = await pool.query(query, [input.idPlano, input.custoMensal]);
    return rows[0] ?? null;
  }

  async listAssinaturasByTipo(tipo: string) {
    const normalizedTipo = tipo.trim().toUpperCase();
    const base = await this.fetchSubscriptions();
    if (normalizedTipo === 'TODOS') return base;
    if (normalizedTipo === 'ATIVOS' || normalizedTipo === 'ATIVAS') {
      return base.filter((item) => item.status === 'ATIVO');
    }
    if (normalizedTipo === 'CANCELADOS' || normalizedTipo === 'CANCELADAS') {
      return base.filter((item) => item.status === 'CANCELADO');
    }
    return [];
  }

  async listAssinaturasByCliente(codCli: number) {
    const base = await this.fetchSubscriptions();
    return base.filter((item) => item.codCli === codCli);
  }

  async listAssinaturasByPlano(codPlano: number) {
    const base = await this.fetchSubscriptions();
    return base.filter((item) => item.codPlano === codPlano);
  }

  async getAssinaturaAtiva(codAss: number): Promise<boolean> {
    const { rows } = await pool.query('SELECT * FROM assinaturas WHERE codigo = $1', [codAss]);
    if (!rows[0]) return false;
    const assinatura = new Assinatura(rows[0]);
    return assinatura.estaAtiva();
  }

  async applyPayment(input: PaymentEventInput): Promise<void> {
    await pool.query(
      `UPDATE assinaturas SET dataultimopagamento = $2 WHERE codigo = $1`,
      [input.codAss, input.dataPagamento],
    );
  }

  private async fetchSubscriptions() {
    const { rows } = await pool.query(`
      SELECT codigo, codplano, codcli, iniciofidelidade, fimfidelidade, dataultimopagamento, custofinal, descricao
      FROM assinaturas
      ORDER BY codigo
    `);

    return rows.map((row) => {
      const assinatura = new Assinatura(row);
      return {
        codigoAssinatura: row.codigo,
        codCli: Number(row.codcli),
        codPlano: Number(row.codplano),
        dataInicio: row.iniciofidelidade,
        dataFim: row.fimfidelidade,
        status: assinatura.estaAtiva() ? 'ATIVO' : 'CANCELADO',
      };
    });
  }
}
