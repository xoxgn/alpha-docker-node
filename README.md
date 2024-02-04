# alpha-docker-node
ALPHA: Docker + Node.js

## Hot-reloading
To get hot-reloading during development, the `nodemon` package can be used instead of `node`.

The command to run the app image as a container would be as follows:
 - `docker compose up -d`

 To stop it, and all its other peripheral services, the command would be:
 - `docker compose down`

## Business Rules
This ia a simple **CRUD** (**C**reate, **R**ead, **U**pdate, **D**elete) API app. The following is a rough outline of the business rules relevant to each operation.

When **creating** an item,
- Email Address must be unique
- Email Address cannot be null or undefined

WHen **reading** a __list of items__,
- It should be possible to specify the desired amount of result to be returned
    - It should be possible to fine-tune this further using the reference to a specific item