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

`node pickSeeder -e`

To export the addresses of the accounts who participated into a CSV file use

`node scoreSeeder -ep`

To export the account point allocation verification data into a CSV file run

`node scoreSeeder -evp`
