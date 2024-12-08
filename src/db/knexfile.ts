import { Knex } from 'knex';
import path from 'path';

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'library.sqlite')
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
};

export default config;