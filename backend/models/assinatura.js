const { pool } = require("../config/database");

class Assinatura {

  static async listar(){

    const query = `
      SELECT
      a.*,
      p.nome AS aluno_nome,
      pl.nome_plano

      FROM assinatura a

      JOIN aluno al
      ON al.id=a.aluno_id

      JOIN pessoa p
      ON p.id=al.pessoa_id

      JOIN plano pl
      ON pl.id=a.plano_id

      WHERE a.deleted_at IS NULL

      ORDER BY a.data_inicio DESC
    `;

    const { rows } =
      await pool.query(query);

    return rows;

  }


  static async alunoPossuiAtiva(
    aluno_id
  ){

    const query=`
      SELECT *
      FROM assinatura

      WHERE aluno_id=$1
      AND status_assinatura='ativa'
      AND deleted_at IS NULL
    `;

    const { rows } =
      await pool.query(
        query,
        [aluno_id]
      );

    return rows[0];

  }


  static async criar(
    aluno_id,
    plano_id
  ){

    const planoQuery=`
      SELECT *
      FROM plano
      WHERE id=$1
    `;

    const plano =
      await pool.query(
        planoQuery,
        [plano_id]
      );

    if(!plano.rows.length){

      throw new Error(
        "Plano não encontrado"
      );

    }

    const meses =
      plano.rows[0]
      .duracao_meses;

    const query = `
      INSERT INTO assinatura(
        aluno_id,
        plano_id,
        data_inicio,
        data_fim,
        status_assinatura,
        data_assinatura
      )

      VALUES(
        $1,
        $2,
        CURRENT_DATE,
        CURRENT_DATE + ($3 || ' month')::INTERVAL,
        'ativa',
        CURRENT_DATE
      )

      RETURNING *
    `;

    const { rows } =
      await pool.query(
        query,
        [
          aluno_id,
          plano_id,
          meses
        ]
      );

    return rows[0];

  }


  static async cancelar(id){

    const query = `
      UPDATE assinatura
      SET status_assinatura='cancelada'

      WHERE id=$1

      RETURNING *
    `;

    const { rows } =
      await pool.query(
        query,
        [id]
      );

    return rows[0];

  }


  static async renovar(id){

    const query = `
      UPDATE assinatura

      SET
      data_inicio=CURRENT_DATE,

      data_fim=
      CURRENT_DATE +
      (
        (
          SELECT duracao_meses
          FROM plano
          WHERE id=assinatura.plano_id
        ) || ' month'
      )::INTERVAL,

      status_assinatura='ativa'

      WHERE id=$1

      RETURNING *
    `;

    const { rows } =
      await pool.query(
        query,
        [id]
      );

    return rows[0];

  }

}

module.exports = Assinatura;