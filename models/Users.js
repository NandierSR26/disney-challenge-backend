const {DataTypes} = require('sequelize');
const db = require('../config/db');
const Character = require('./Characters');
const MoviesSeries = require('./Movies-Series');
const uuid = require('uuid').v4;

const Users = db.define('users', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuid()
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

Users.hasMany(Character, {
    foreignKey: 'userId',
    sourceKey: 'id',
});

Users.hasMany(MoviesSeries, {
    foreignKey: 'userId',
    sourceKey: 'id',
})


module.exports = Users;