const db = require('../persistence');
const {v4 : uuid} = require('uuid');

async function addItem(req, res) {
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
    };

    await db.storeItem(item);
    res.send(item);
};


async function getItems (req, res) {
    const items = await db.getItems();
    res.send(items);
};


async function updateItem (req, res) {
    await db.updateItem(req.params.id, {
        name: req.body.name,
        completed: req.body.completed,
    });
    const item = await db.getItem(req.params.id);
    res.send(item);
};

async function deleteItem (req, res)  {
    await db.removeItem(req.params.id);
    res.sendStatus(200);
};

// =========
module.exports = {
    getItems,
    addItem,
    updateItem,
    deleteItem
}