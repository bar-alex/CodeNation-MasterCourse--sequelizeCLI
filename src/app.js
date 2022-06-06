const yargs = require("yargs");
const { hideBin } = require('yargs/helpers')

const { sequelize } = require("./db/connection");
const { addMovie, updateMovie, listMovies, deleteMovies } = require("./movie/functions");

const app = async (yargsObj) => {
    try {

        // console.log('->app.js - yargsObj: ',yargsObj);

        // create the table if it doesn't exist
        await sequelize.sync();
        // console.log('sequelize: ',sequelize);

        // if --title is not specified but the text is, the property will be created, 
        // ex: node app.js --add "The Man from Earth" --actor "David Lee Smith"
        if( !yargsObj['title'] && [typeof yargsObj.add, typeof yargsObj.list, typeof yargsObj.update, typeof yargsObj.delete].indexOf('string')>-1 )
            yargsObj.title = typeof yargsObj.add == 'string' 
                ? yargsObj.add
                : typeof yargsObj.list === 'string' 
                ? yargsObj.list
                : typeof yargsObj.update === 'string' 
                ? yargsObj.update
                : typeof yargsObj.delete === 'string'
                ? yargsObj.delete
                : undefined

        if (yargsObj.add) {
            // take movie key value pairs from yargsObj, send them to an add function
            await addMovie( {title: yargsObj.title, actor: yargsObj.actor, seasons: yargsObj.seasons}, yargsObj.platform )

        } else if (yargsObj.list) {
            // list all movies from database
            if (yargsObj.title)
                await listMovies( {title: yargsObj.title}, yargsObj.platform )
            else if (yargsObj.actor)
                await listMovies( {actor: yargsObj.actor}, yargsObj.platform )
            else 
                await listMovies( undefined, yargsObj.platform )
            
        } else if (yargsObj.update) {
            // take filter and update k/v pairs from yargsObj, send them to update function
            await updateMovie( {title: yargsObj.title}, yargsObj, yargsObj.platform )

        } else if (yargsObj.delete) {
            // take filter k/v pair from yargsObj and send them to delete function, return success/failure
            await deleteMovies( {title: yargsObj.title}, yargsObj.platform )

        } else 
            console.log("Incorrect command: yargsObj: ", yargsObj);
    } catch (error) {
        console.log(error)
    } finally {
        await sequelize.close()
    }
}


// --add, --list, --update, --delete, --platform (movie,tv)
// --title "title", --actor "actor", --newTitle "title", --newActor "actor"

// the define the parameters
const yargsObj = yargs(hideBin(process.argv))
    .describe('add','adds a new movie (--title and --actor)')
    .describe('list','lists the movie(s) specified in the filter (--title / --actor / none)')
    .describe('update','updates the movie (--title as filter and --newTitle and/or --newActor )')
    .describe('delete','deletes the movie(s) specified in the filter (--title or --actor)')
    .describe('platform','specify the targeted platform ("movie" or "tv"), defaults to "movie"')
    .choices('platform', ['movie','tv'])        // if specified can only choose between movie and tv
    .alias('title','movie')                     // --title or --movie
    .help('help')
    .check( (argv)=>{
        // either of the main ones must be specified
        if(!( argv['add'] || argv['list'] || argv['update'] || argv['delete'] ))
            throw new Error('You have to specify one: add, list, update or delete')
        
        // check that add-ing is done proper (--title can be missing if the text is assigned to --add)
        if( !!argv['add'] && (!argv['title'] && typeof argv['add'] !== 'string') )
            throw new Error('For adding (--add) you have to specify at least the title (--title)')

        // check that update-ing is done proper (--title can be missing if the text is assigned to --update, must have newTitle or newActor)
        if( !!argv['update'] && (!argv['title'] && typeof argv['update'] !== 'string') && !(argv['newTitle'] || argv['newActor']) )
            throw new Error('For updating (--update) you have to specify the title (--title) as a filter and at least --newTitle or --newActor')

        // check that update-ing is done proper (--title can be missing if the text is assigned to --update, must have newTitle or newActor)
        if( !!argv['delete'] && (!argv['title'] && typeof argv['delete'] !== 'string') )
            throw new Error('For deleting (--delete) you have to specify the title (--title) as a filter')

        // if it got here there's not problems anywhere
        return true;
    } )
    .argv

// app(yargs.argv)
app(yargsObj)
