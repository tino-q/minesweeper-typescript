# Minesweeper

This is a typescript express API for playing a the well known minesweeper game.

It uses DynamoDB for persistance and Jest for testing.

The application is currently hosted in a EC2 managed by ElasticBeanstalk using a dockerized environment (check the `Dockerfile`)

SSL is certified by LetsEncrypt :)

Check the swagger docs [here](https://msfttt-env.eba-32y2i3df.us-east-1.elasticbeanstalk.com/swagger "Swagger")

# Installation

`npm install` is enough to run the tests (`npm test`).

You'll need a local running version of dynamo to run the application.

To run the app get the jar distribution of DynamoDB and run it using: 

`java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`

Check the running port and set the environment variable

`BOARD_TABLE_ENDPOINT=http://localhost:{DynamoDBPort}`

Environment variables are loaded from the `.env` file using the `dotenv` package.

Once the application is running you can check the swagger documentation at `http://localhost:8080/swagger`