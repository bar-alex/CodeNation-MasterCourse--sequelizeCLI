const { sequelize } = require("../db/connection");
const { Movie, TvSeries, Director } = require("./table");
const { Op } = require("sequelize");


exports.addMovie = async (movieObj, platform) => {
    try {

        // if a director was specified, find the director, if not add a new one and retrieve it's id
        if (movieObj.director){
            // find or create the director
            const director = await Director.findOrCreate({ where: {fullName: movieObj.director} });
            // assign the director's id to the movie
            movieObj.directorID = director[0].id;
            // delete the director property from the movieObj
            delete movieObj.director;
        }

        // create the movie in the TvSeries or in the Movie tables, depending on the platform
        const newMovie = (!!platform && platform.toLowerCase() === 'tv' )
            ? await TvSeries.create( movieObj )
            : await Movie.create( movieObj );

        console.log(`-> addMovie: The movie "${ newMovie.dataValues.title }" was inserted in the database with the id ${newMovie.dataValues.id}`);

    } catch (error) {
        console.log("\n-> addMovie thrown an error: \n",'movieObj: ',movieObj,'\n',error);
    }
}


// return a list of movies that matches the filter provided
exports.listMovies = async (filterObj, platform) => {
    try {
        console.log("-> listMovies param: ",filterObj, platform);
        // console.log( 'sequelize.options.logging:', sequelize.options.logging );
        // attempt to create the object for the where clause that includes the 'like' for '%'
        if( typeof filterObj === 'object' )
            Object.keys(filterObj).map( (key,idx) => {
                if (!filterObj[key])
                    delete filterObj[key]
                else if( typeof filterObj[key] === 'string' && filterObj[key].indexOf('%')>-1 )
                    filterObj[key] = { [Op.like]: filterObj[key] }
            } )
        console.log('-> filterObj after:',filterObj);

        //const whereCond = { Where: {title: ""} } 
        const movieList = !!platform && platform.toLowerCase() === 'tv'
            ? await TvSeries.findAll( {where: filterObj, include: [{model: Director}] } )
            : await Movie.findAll( {
                    where: filterObj, 
                    include: Director,
                    attributes: ['id', 'title', 'actor', 'director.fullName'], 
                } )
        // display just the simple objects
        // console.log( movieList );
        console.table( movieList.map( it => { return {...it.dataValues, 'director': it.dataValues.director ? it.dataValues.director.fullName : 'N/A'} } ) )
        // console.log(movieList.map( it => it.dataValues ));

    } catch (error) {
        console.log("\n-> listMovies thrown an error: \n",'filterObj: ',filterObj,'\n',error);
    }
}


// will update a single movie - will search for the movie (only one) with filterObj and change it in place, then run update
exports.updateMovie = async (filterObj, updateObj, platform) => {
    try {
         // get the doc for the filter
        const newMovie = !!platform && platform.toLowerCase() === 'tv'
            ? await TvSeries.findOne( {where: filterObj} )
            : await Movie.findOne( {where: filterObj} )

        // update all the fields that have been specified with newFieldName
        Object.keys(updateObj).forEach( key => 
                key.slice(0,3)=='new' && newMovie[key.slice(3).toLowerCase()]
                ? newMovie[key.slice(3).toLowerCase()] = updateObj[key] 
                : false //console.log( key, key.slice(0,3), key.slice(3).toLowerCase(), newMovie[key.slice(3).toLowerCase()], updateObj[key] )
            )

        // if a director was specified, find the director, if not add a new one and retrieve it's id
        if (updateObj.newDirector){
            // find or create the director
            const director = await Director.findOrCreate({ where: {fullName: updateObj.newDirector} });
            // assign the director's id to the movie
            newMovie.directorID = director[0].id;
        }

        // save the changed document
        const result = await newMovie.save()
        // if it didn't update it would have thrown an error ?
        if (result) console.log("-> updateMovie: Successfully updated: ",result.dataValues);
        else        console.log("-> updateMovie: Something went wrong: ",result);

    } catch (error) {
        console.log("\n-> updateMovie thrown an error: \n",'filterObj: ', filterObj,'\n','updateObj: ',updateObj,'\n',error);
    }
}


// will delete movies based on the filterObj (akin to listMovies)
exports.deleteMovies = async (filterObj, platform) => {
    try {
        const response = !!platform && platform.toLowerCase() === 'tv'
            ? await TvSeries.destroy( {where: filterObj} ) 
            : await Movie.destroy( {where: filterObj} )

        if (response>0)
            console.log("-> deleteMovies: Successfully deleted", response);
        else 
            console.log("-> deleteMovies: Nothing eas deleted for filterObj:",filterObj);
    } catch (error) {
        console.log("\n-> deleteMovies thrown an error: \n",'filterObj: ',filterObj,'\n',error);
    }
}