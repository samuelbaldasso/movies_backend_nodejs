const knex = require('knex')(require('../knexfile'));
const knexInstance = knex(require('./knexfile'));
knexInstance.raw('PRAGMA foreign_keys = ON');

knexInstance.schema
    .createTable("users", table => {
        table.increments('id');
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.string('avatar');
        table.date('created_at');
        table.date('updated_at');
    })
    .createTable('films', (table) => {
        table.increments('id');
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.decimal('nota').notNullable();
        table.integer('users_id').references('id').inTable('users').notNullable();
        table.date('created_at');
        table.date('updated_at');
    })
    .createTable('tags', (table) => {
        table.increments('id');
        table.string('name').notNullable();
        table.integer('film_id').references('id').inTable('films').notNullable().onDelete('CASCADE');
        table.integer('users_id').references('id').inTable('users').notNullable();
    })
    .then(() => {
        console.log('Tabelas criadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error(`Erro ao criar tabelas: ${error}`);
        process.exit(1);
    });
