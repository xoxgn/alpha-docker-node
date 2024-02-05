const {v4 : uuid} = require('uuid');

/**
 * 
 * 
 * @param {RequestAgnostic} req 
 * @param {import('../persistence').PersistenceModule} db 
 * @returns {ResponseAgnostic} 
 */
async function addItem(req, db) {
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
    };

    await db.storeItem(item);

    return {
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: 200,
        data: JSON.stringify(item)
    }
};

/**
 * 
 * 
 * @param {RequestAgnostic} req 
 * @param {import('../persistence').PersistenceModule} db 
 * @returns {ResponseAgnostic} 
 */
async function getItems (req, db) {
    const {id} = req.pathParams || {}

    const result = id 
        ? await db.getItem(id) 
        : await db.getItems();

    return {
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: 200,
        data: JSON.stringify(result)
    }
};

/**
 * 
 * 
 * @param {RequestAgnostic} req 
 * @param {import('../persistence').PersistenceModule} db 
 * @returns {ResponseAgnostic} 
 */
async function updateItem (req, db) {
    const {id} = req.pathParams || {}
    const {completed, name} = req.body || {}

    await db.updateItem(id, {
        name: name,
        completed: completed,
    });
    const item = await db.getItem(id);

    return {
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: 200,
        data: JSON.stringify(item)
    }
};

/**
 * 
 * 
 * @param {RequestAgnostic} req 
 * @param {import('../persistence').PersistenceModule} db 
 * @returns {ResponseAgnostic} 
 */
async function deleteItem (req, db)  {
    const {id} = req.pathParams || {}

    await db.removeItem(id);

    return {
        statusCode: 204
    }
};

/**
 * 
 * @typedef RequestAgnostic
 * @type {object}
 * @property {string} path
 * @property {string} method
 * @property {{id?: string}} pathParams
 * @property {{max: number, after: string, before: string}} queryParams
 * @property {{name?: string, completed?: boolean}} body
 * 
 * 
 * @typedef ResponseAgnostic
 * @type {ResponseAgnosticFull | ResponseAgnosticSlim}
 * 
 * @typedef ResponseAgnosticSlim
 * @type {object}
 * @property {204} statusCode // HTTP No Content
 * 
 * @typedef ResponseAgnosticFull
 * @type {object}
 * @property {{"Content-Type": string}} headers
 * @property {number} statusCode
 * @property {string} data
 * 
 * 
 */

// =========
module.exports = {
    getItems,
    addItem,
    updateItem,
    deleteItem
}