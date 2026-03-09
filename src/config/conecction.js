import { Sequelize } from 'sequelize';
import { dbConfig } from './db.js';

const db = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'mysql',
        logging: true, // Cambia a console.log si quieres ver las queries
});

export default db;