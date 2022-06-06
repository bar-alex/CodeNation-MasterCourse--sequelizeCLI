const Movie = require("./table");


exports.addMovie = async (movieObj) => {
    try {
        const newMovie = await Movie.create( movieObj );
        console.log(`The movie "${newMovie.DataValues.title}" was inserted in the databae with the id: `,newMovie.DataValues.id);
    } catch (error) {
        throw Exception("addMovie thrown an error: ",error);
    }
}


exports.listMovies = async (filterObj) => {
    try {
        const whereCond = { Where: {title: ""} } 
        const movieList = await Movie.findAll()
    } catch (error) {
        throw Exception("listMovies thrown an error: ",error);
    }
}


// will update a single movie - will search for the movie (only one) with filterObj and change it in place, then run update
exports.updateMovie = async (filterObj, movieObj) => {
    try {
        
    } catch (error) {
        throw Exception("updateMovie thrown an error: ",error);
    }
}


// will delete movies based on the filterObj (akin to listMovies)
exports.deleteMovies = async (filterObj) => {
    try {
        
    } catch (error) {
        throw Exception("deleteMovies thrown an error: ",error);
    }
}