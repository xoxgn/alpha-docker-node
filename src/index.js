const express = require('express');
const app = express();
const db = require('./persistence');
const {addItem, deleteItem, getItems, updateItem} = require("./routes")

app.use(express.json());

app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.send('<h1>The data endpoint is at "<code>/items</code>"</h1>')
})

db.init().then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon