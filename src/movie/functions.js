const { Movie, TvSeries } = require("./table");


exports.addMovie = async (movieObj, platform) => {
    try {
        //console.log('will use tvseries? ', !!platform && platform.toLowerCase() === 'TvSeries'.toLowerCase() );
        const newMovie = (!!platform && platform.toLowerCase() === 'tv' )
            ? await TvSeries.create( movieObj )
            : await Movie.create( movieObj );

        console.log(`-> addMovie: The movie "${ newMovie.dataValues.title }" was inserted in the database with the id ${newMovie.dataValues.id}`);
        // const newMovie = Movie.build( movieObj )
        // const result = await newMovie.save()
        // console.log(`-> addMovie: The movie "${result.DataValues.title}" was inserted in the database with the id: `, result.DataValues.id);

    } catch (error) {
        console.log("\n-> addMovie thrown an error: \n",'movieObj: ',movieObj,'\n',error);
    }
}


// return a list of movies that matches the filter provided
exports.listMovies = async (filterObj, platform) => {
    try {
        console.log("-> listMovies param: ",filterObj, platform);
        //const whereCond = { Where: {title: ""} } 
        const movieList = !!platform && platform.toLowerCase() === 'tv'
            ? await TvSeries.findAll( {where: filterObj} )
            : await Movie.findAll( {where: filterObj} )
        // display just the simple objects
        console.table( movieList.map( it => it.dataValues ) )
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