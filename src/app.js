const yargs = require("yargs");
const { hideBin } = require('yargs/helpers')

const { sequelize } = require("./db/connection");
const { addMovie,updateMovie,listMovies,deleteMovies } = require("./movie/functions");
// const { Movie, TvSeries, Directors } = require("./movie/table")


const app = async (yargsObj) => {
    try {

        // show the object only if logging is true
        if (yargsObj.logging)
            console.log('->app.js - yargsObj: ',yargsObj);

        // enable / disable logging
        sequelize.options.logging = yargsObj.logging ? console.log : false;

        // create the tables and relations if they doesn't exist, otherwise is not needed
        if (yargsObj.setup)
            try {
                //await sequelize.sync({ alter: true, logging: yargsObj.logging });
                await sequelize.sync({ alter: true });
            } catch (error) {
                throw error
            }

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
            await addMovie( {
                title: yargsObj.title, 
                actor: yargsObj.actor, 
                seasons: yargsObj.seasons, 
                director: yargsObj.director,
            }, yargsObj.platform )

        } else if (yargsObj.list) {
            // list all movies from database
            if (yargsObj.title || yargsObj.actor || yargsObj.director)
                await listMovies( {
                    title: yargsObj.title, 
                    actor: yargsObj.actor,
                    director: yargsObj.director,
                }, yargsObj.platform )
            else 
                await listMovies( undefined, yargsObj.platform )
            
        } else if (yargsObj.update) {
            // take filter and update k/v pairs from yargsObj, send them to update function
            await updateMovie( {title: yargsObj.title}, yargsObj, yargsObj.platform )

        } else if (yargsObj.delete) {
            // take filter k/v pair from yargsObj and send them to delete function, return success/failure
            await deleteMovies( {title: yargsObj.title}, yargsObj.platform )

        } else if (yargsObj.setup) {
            // just in case it runs only with setup, don't need to tdo anything
        } else 
            console.log("Incorrect command: yargsObj: ", yargsObj);
    } catch (error) {
        console.log(error)
    } finally {
        await sequelize.close()
    }
}


// the define the parameters
const yargsObj = yargs(hideBin(process.argv))
    .describe('add','adds a new movie (--title, --actor and --director)')
    .describe('list','lists the movie(s) specified in the filter (--title / --actor / --director / none)')
    .describe('update','updates the movie (--title as filter and --newTitle and/or --newActor and/or --newDirector )')
    .describe('delete','deletes the movie(s) specified in the filter (--title or --actor or --director)')
    .describe('platform','specify the targeted platform ("movie" or "tv")')
    .describe('setup','will set up the tables and the relations between them - needed only once')
    .describe('logging','whether to show or not the sql commands executed behind the scene')

    .alias('title','movie')                     // --title or --movie

    .choices('platform', ['movie','tv'])        // if specified can only choose between movie and tv

    .default('platform','movie')
    .boolean('logging')
    .default('logging',false)

    .conflicts('add', 'list')
    .conflicts('add', 'update')
    .conflicts('add', 'delete')
    .conflicts('list', 'update')
    .conflicts('list', 'delete')
    .conflicts('update', 'delete')
    
    .check( (argv)=>{
        // either of the main ones must be specified
        if(!( argv['add'] || argv['list'] || argv['update'] || argv['delete'] || argv['setup'] ))
            throw new Error('You have to specify one: add, list, update, delete or setup')
        
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

    .help('help')
    .argv


// app(yargs.argv)
app(yargsObj)







// await connection.authenticate();
// await Country.sync({alter: true});
// await Capital.sync({alter: true});
// await City.sync({alter: true});
