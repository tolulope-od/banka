import { Pool } from 'pg';
import dotenv from 'dotenv';
import Debug from 'debug';

dotenv.config();

const debug = Debug('dev');

export default class Model {
  constructor(table) {
    this.table = table;
    this.pool = Model.initConn();
    this.pool.on('error', err => debug('postgres')(err));
  }

  async select(params, constraint) {
    try {
      const result = await this.pool.query(
        `SELECT ${params} FROM ${this.table} WHERE ${constraint}`
      );
      debug(result.rows);
      return result.rows;
    } catch (err) {
      return debug(err.message);
    }
  }

  async create(params, values) {
    try {
      const result = await this.pool.query(
        `INSERT INTO ${this.table}(${params}) VALUES(${values}) RETURNING *`
      );
      debug(result.rows);
      return result.rows;
    } catch (err) {
      return debug(err.message);
    }
  }

  async update(params, constraints) {
    try {
      const result = await this.pool.query(
        `UPDATE ${this.table} SET ${params} WHERE ${constraints} RETURNING *`
      );
      debug(result.rows);
      return result.rows;
    } catch (err) {
      return debug(err.message);
    }
  }

  async delete(params, constraint) {
    try {
      const result = await this.pool.query(
        `DELETE FROM ${this.table} ${params} WHERE ${constraint}`
      );
      debug(result);
      return result;
    } catch (err) {
      return debug(err.message);
    }
  }

  async selectAll(params) {
    try {
      const result = await this.pool.query(`SELECT ${params} FROM ${this.table}`);
      debug(result.rows);
      return result.rows;
    } catch (err) {
      return debug(err.message);
    }
  }

  static initConn() {
    const { USER, HOST, DATABASE, PASSWORD, DB_PORT } = process.env;
    const poolSettings = {
      user: USER,
      host: HOST,
      password: PASSWORD,
      database: DATABASE,
      port: DB_PORT
    };

    debug(`Pool Settings: ${JSON.stringify(poolSettings)}`);
    return new Pool(poolSettings);
  }
}
