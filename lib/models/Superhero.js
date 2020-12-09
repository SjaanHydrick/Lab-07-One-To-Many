const pool = require('../utils/pool.js');
const Supervillain = require('./Supervillain');

module.exports = class Superhero {
    id;
    alias;
    name;
    powers;
    city;

    constructor(row) {
      this.id = row.id;
      this.alias = row.alias;
      this.name = row.name;
      this.powers = row.powers;
      this.city = row.city;
    }

    static async insert({ alias, name, powers, city }) {
      const { rows } = await pool.query(
        'INSERT INTO superheroes (alias, name, powers, city) VALUES ($1, $2, $3, $4) RETURNING *', [alias, name, powers, city]
      );

      return new Superhero(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `
            SELECT
              superheroes.*,
              array_to_json(array_agg(supervillains.*)) AS supervillains
            FROM
              superheroes
            JOIN supervillains
            ON superheroes.id = supervillains.superhero_id
            WHERE superheroes.id=$1
            GROUP BY superheroes.id
            `,
        [id]
      );

      if(!rows[0]) throw new Error(`No superhero with id ${id} found`);

      return {
        ...new Superhero(rows[0]),
        supervillains: rows[0].supervillains.map(supervillain => new Supervillain(supervillain))
      };
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM superheroes');

      return rows.map(row => new Superhero(row));
    }

    static async update(id, { alias, name, powers, city }) {
      const { rows } = await pool.query(
        `UPDATE superheroes
              SET alias=$1,
              name=$2,
              powers=$3,
              city=$4
              WHERE id=$5
              RETURNING *`, [alias, name, powers, city, id]
      );

      if(!rows[0]) throw new Error(`No superhero with id ${id} found`);
      return new Superhero(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM superheroes WHERE id=$1 RETURNING *', [id]
      );

      return new Superhero(rows[0]);
    }
};
