const yargs = require("yargs");
const { sequelize } = require("./db/connection");
const { addMovie } = require("./movie/functions");

const app = async (yargsObj) => {
    try {
        // create the table if it doesn't exist
        await sequelize.sync();

        if (yargsObj.add) {
            // take movie key value pairs from yargsObj, send them to an add function
            await addMovie( {title: yargsObj.title, actor: yargsObj.actor} )

        } else if (yargsObj.list) {
            // list all movies from database
            
        } else if (yargsObj.update) {
            // take filter and update k/v pairs from yargsObj, send them to update function

        } else if (yargsObj.delete) {
            // take filter k/v pair from yargsObj and send them to delete function, return success/failure

        } else 
            console.log("Incorrect command: yargsObj: ", yargsObj);
    } catch (error) {
        console.log(error)
    }
}

app(yargs.argv)
