const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");


const Movie = sequelize.define("movie", 
{
    title: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true,
    },
    actor: {
        type: DataTypes.STRING,
        defaultValue: "Not specified",
    },
},
{
    indexes: [
        {
            fields: ['title'],
        },
        {
            fields: ['actor'],
        },
        {
            type: "FULLTEXT",
            fields: ['title', 'actor'],
        },

    ],
    timestamps: false,
}
);


const TvSeries = sequelize.define("tvseries", 
{
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
},
{
    indexes: [
        {
            fields: ['title'],
        },
        {
            fields: ['actor'],
        },
        {
            type: "FULLTEXT",
            fields: ['title', 'actor'],
        },

    ],
    timestamps: false
}
)


const Director = sequelize.define("director", {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
},
{
    timestamps: false,
});


Director.hasMany(Movie, { foreignKey: 'directorID', onDelete: 'CASCADE' });
Movie.belongsTo(Director, { foreignKey: 'directorID', onDelete: 'CASCADE' });

Director.hasMany(TvSeries, { foreignKey: 'directorID', onDelete: 'CASCADE' })
TvSeries.belongsTo(Director, { foreignKey: 'directorID', onDelete: 'CASCADE' });


// await Movie.sync( {alter: true} )
// await TvSeries.sync( {alter: true} )
// await Director.sync( {alter: true} )


//console.log('-> table.js :: this is run');

module.exports = {
    Movie,
    TvSeries,
    Director,
} ;




// Country.hasOne(Capital);
// Capital.belongsTo(Country);

// Country.hasMany(City);
// City.belongsTo(Country);