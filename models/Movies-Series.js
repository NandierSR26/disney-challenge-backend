const {DataTypes} = require('sequelize');
const db = require('../config/db');

const MoviesSeries = db.define('movies_series', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    image: {
        type: DataTypes.STRING,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    date: {
        type: DataTypes.STRING,
    },
    qualification: {
        type: DataTypes.INTEGER,
    },
    category: {
        type: DataTypes.STRING,
    },
    characters: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    gender: {
        type: DataTypes.STRING
    }
}, {
    hooks: {
        beforeCreate(movie) {
            movie.title = movie.title.toUpperCase();
        }
    }
});




module.exports = MoviesSeries;