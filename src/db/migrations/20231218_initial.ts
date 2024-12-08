import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('books', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.string('isbn').notNullable().unique();
    table.boolean('available').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('book_ratings', (table) => {
    table.increments('id').primary();
    table.integer('book_id').references('id').inTable('books').onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.integer('score').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('borrowings', (table) => {
    table.increments('id').primary();
    table.integer('book_id').references('id').inTable('books').onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('borrowed_at').defaultTo(knex.fn.now());
    table.timestamp('returned_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('borrowings');
  await knex.schema.dropTable('book_ratings');
  await knex.schema.dropTable('books');
  await knex.schema.dropTable('users');
}
