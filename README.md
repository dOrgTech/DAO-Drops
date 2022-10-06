# DAO-Drops

Full stack MERN app for the DAO Drops Project

This project uses MongoDB's Atlas for its database

To run the project locally cd into the project folder and then open another terminal.

In one terminal cd to client and in the other cd to server

In the server terminal run npm start to start express

In the client terminal run yarn start

### The following commands for seeding the database are to be run inside the server folder

To import a score sheet put the ScoreSheet.json into the scoreData folder inside server then run

`node scoreSeeder -i`

To delete the current score sheet stored in mongoDB run

`node scoreSeeder -d`

To import a curated list of project picks put the Picks.json into the pickData folder inside server then run

`node pickSeeder -i`

To delete the current curated list of project picks stored in mongoDB run

`node pickSeeder -d`

To delete the post data from submissions from the mongo DB run

`node scoreSeeder -dp`

To export submission posts from the database into a CSV file run the command

'node pickSeeder -e'
