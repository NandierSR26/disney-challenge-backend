const {DataTypes} = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid').v4;

const Gender = db.define('gender', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuid()
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.STRING,
    },
    movies_series: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    }
});

module.exports = Gender;