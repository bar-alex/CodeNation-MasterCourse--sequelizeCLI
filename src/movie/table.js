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

    ]
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

    ]
}
)


const Director = sequelize.define("director", {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});


// Director.hasMany( Movie, { as: 'movie', foreignKey: "directorID" });
Movie.belongsTo(Director, { foreignKey: "directorID" });

// Director.hasMany( TvSeries, { as: 'tvshow', foreignKey: "directorID" } )
TvSeries.belongsTo(Director, { foreignKey: "directorID" });


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