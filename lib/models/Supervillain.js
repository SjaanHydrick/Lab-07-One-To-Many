const pool = require('../utils/pool');

module.exports = class Supervillain {
    id;
    alias;
    name;
    powers;
    superheroId;

    constructor(row) {
      this.id = String(row.id);
      this.alias = row.alias;
      this.name = row.name;
      this.powers = row.powers;
      this.superheroId = String(row.superhero_id);
    }

    static async insert({ alias, name, powers, superheroId }) {
      const { rows } = await pool.query(
        'INSERT INTO supervillains (alias, name, powers, superhero_id) VALUES ($1, $2, $3, $4) RETURNING *', [alias, name, powers, superheroId]
      );

      return new Supervillain(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM supervillains WHERE id=$1', [id]
      );

      if(!rows[0]) throw new Error(`No supervillains with id ${id}`);
      return new Supervillain(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM supervillains');

      return rows.map(row => new Supervillain(row));
    }

    static async update(id, { alias, name, powers, superheroId }) {
      const { rows } = await pool.query(
        `UPDATE supervillains
            SET alias=$1,
            name=$2,
            powers=$3,
            superhero_id=$4
            RETURNING *`, [alias, name, powers, superheroId]
      );

      if(!rows[0]) throw new Error(`No supervillian with id ${id} found`);
      return new Supervillain(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query('DELETE FROM supervillain WHERE id=$1 RETURNING *', [id]);

      return new Supervillain(rows[0]);
    }
};
