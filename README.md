# DAO-Drops

Full stack MERN app for the DAO Drops Project

This project uses MongoDB's Atlas for its database

To run the project locally cd into the project folder and then open another terminal.

In one terminal cd to client and in the other cd to server

In the server terminal run npm start to start express

In the client terminal run yarn start

to import a score sheet put the ScoreSheet.json into the scoreData folder inside server then

run `node scoreSeeder -i`

to delete the current score sheet stored in mongoDB run

`node scoreSeeder -d`

to import a curated list of project picks put the Picks.json into the pickData folder inside server then

run `node scoreSeeder -i`

to delete the current curated list of project picks stored in mongoDB run

`node scoreSeeder -d`
