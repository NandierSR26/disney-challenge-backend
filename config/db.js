const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env' });

module.exports = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: 'postgres',
    // dialectOptions: {
        // ssl: {
            // require: true,
            // rejectUnauthorized: false
        // }
    // },
    logging: false
});