const { DataTypes } = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid').v4;
const MoviesSeries = require('./Movies-Series');

const Character = db.define('character', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuid()
    },
    image: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
    },
    weight: {
        type: DataTypes.FLOAT,
    },
    history: {
        type: DataTypes.TEXT,
    },
    movies_series: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    }
}, {
    hooks: {
        beforeCreate(character) {
            character.name = character.name.toUpperCase();
        }
    }
});



module.exports = Character;