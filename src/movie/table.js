const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const Movie = sequelize.define("movie", {
    title: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true,
    },
    actor: {
        type: DataTypes.STRING,
        defaultValue: "Not specified",
    },
});

const TvSeries = sequelize.define("tvseries", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    actor: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Not specified",
    }, 
    seasons: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }
})

module.exports = {
    Movie,
    TvSeries,
} ;
