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


// parses the filter object and returns an array of two objects, the includeObj and the changed filterObj
// sets up includeObj to add the Director model to the query (join), changes filterObj to contain [Op.like] as neede by the query
// used in listMovies() and deleteMovies()
const _formatIncludeAndFilterObjects = (filterObj) => {
    
    // for director table, i need a new object
    const includeObj = {model: Director}

    // only if i have a filter
    if( typeof filterObj === 'object' ) {

        // if director is specified i'll add an where clause to include
        if( !!filterObj['director']){
            includeObj.where = filterObj['director'].indexOf('%')>-1 
                ? {fullName: { [Op.like]: filterObj['director'] } } 
                : {fullName: filterObj['director']}
            // remove this because is not needed
            delete filterObj.director
        }

        // attempt to create the object for the where clause that includes the 'like' for '%'
        Object.keys(filterObj).map( (key,idx) => {
            if (!filterObj[key])
                delete filterObj[key]
            else if( typeof filterObj[key] === 'string' && filterObj[key].indexOf('%')>-1 )
                filterObj[key] = { [Op.like]: filterObj[key] }
        } )
    }

    // return an array of the two objects for destructuring
    return [ filterObj, includeObj ]
}


// return a list of movies that matches the filter provided
exports.listMovies = async (filteringObj, platform) => {
    try {
        // console.log("-> listMovies param: ",filterObj, platform);
        
        const [ filterObj, includeObj ] = _formatIncludeAndFilterObjects(filteringObj);

        // console.log('-> filterObj after:',filterObj);
        // console.log('-> includeObj after:',includeObj);

        //const whereCond = { Where: {title: ""} } 
        const movieList = !!platform && platform.toLowerCase() === 'tv'
            ? await TvSeries.findAll( {
                    where: filterObj, 
                    include: includeObj,
                    attributes: ['id', 'title', 'actor', 'seasons', 'director.fullName'], 
                } )
            : await Movie.findAll( {
                    where: filterObj, 
                    include: includeObj,
                    attributes: ['id', 'title', 'actor', 'director.fullName'], 
                } )
        // console.log( movieList );

        // display just the simple objects
        console.log('\n-> listMovies: These are the results of your query:');
        // displays it nice in a table
        console.table( movieList.map( it => { return {
                ...it.dataValues, 
                'director': it.dataValues.director ? it.dataValues.director.fullName : 'N/A'
            }} ) )

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
exports.deleteMovies = async (filteringObj, platform) => {
    try {

        const [ filterObj, includeObj ] = _formatIncludeAndFilterObjects(filteringObj);

        // console.log('-> filterObj after:',filterObj);
        // console.log('-> includeObj after:',includeObj);

        //const whereCond = { Where: {title: ""} } 
        const response = !!platform && platform.toLowerCase() === 'tv'
            ? await TvSeries.destroy( {
                    where: filterObj, 
                    include: includeObj,
                } )
            : await Movie.destroy( {
                    where: filterObj, 
                    include: includeObj,
                } )


        if (response>0)
            console.log("-> deleteMovies: Successfully deleted", response);
        else 
            console.log("-> deleteMovies: Nothing was deleted for filterObj:",filterObj);
    } catch (error) {
        console.log("\n-> deleteMovies thrown an error: \n",'filterObj: ',filterObj,'\n',error);
    }
}
