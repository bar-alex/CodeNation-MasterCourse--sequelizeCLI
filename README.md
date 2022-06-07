# CodeNation-MasterCourse--sequelizeCLI

Sample CLI project to manage a simple movie database using the Sequelize ORM with a MySQL backend.

Uses Yargs, Sequelize, MySQL2 node packages.


---
These are the available options: 

```
$ node src/app.js --help
Options:
  --version   Show version number                                                                 [boolean]
  --add       adds a new movie (--title, --actor and --director)
  --list      lists the movie(s) specified in the filter (--title / --actor / --director / none)
  --update    updates the movie (--title as filter and --newTitle and/or --newActor and/or --newDirector)
  --delete    deletes the movie(s) specified in the filter (--title or --actor or --director)
  --platform  specify the targeted platform ("movie" or "tv")
                                                                [choices: "movie", "tv"] [default: "movie"]
  --setup     will set up the tables and the relations between them - needed only once
  --logging   whether to show or not the sql commands executed behind the scene
                                                                                           [default: false]
  --help      Show help                                                                           [boolean]
```
---
```
Some examples: 

node src/app.js --add --title "Spiderman" --actor "Tom Holland"
node src/app.js --add "Spiderman 2" --actor "Toby Maguire" --platform movie
node src/app.js --update --title "Spiderman 2" --newActor "Andrew Garfield"
node src/app.js --list

node src/app.js --add --title "LOST" --seasons 7 --platform tv
node src/app.js --platform tv --add "Black Widow" --actor "Scarlett Johansson" --seasons 3
node src/app.js --platform tv --list
```
