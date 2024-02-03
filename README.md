# alpha-docker-node
ALPHA: Docker + Node.js

## Hot-reloading
To get hot-reloading during development, the `nodemon` package can be used instead of `node`.

Assuming a Docker image named '**alpha-docker-node**' has already been built, the command to run it as a container would be as follows:
 - `docker run -p 3000:3000 -v $PWD:/usr/src/app -v /usr/src/app/node_modules alpha-docker-node nodemon src/index.js`