// @ts-check
const {v4 : uuid} = require('uuid');
const { maker } = require('../utils');

/**
 * 
 * 
 * @param {RequestAgnostic} req 
 * @param {import('../persistence').PersistenceModule} db 
 * @returns {Promise<ResponseAgnostic>} 
 */
async function addItem(req, db) {
    const {body} = req;

    if (!body) {
        return maker({
            type: "error",
            data: {
                statusCode: 400,
                statusMessage: "Bad Request. No POST body."
            }
        })
    }

    const item = {
        id: uuid(),
        name: body.name,
        completed: false,
    };

    await db.storeItem(item);

    return {
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: 200,
        data: {
            success: true,
            data: item
        }
    }
};

/**
 * 
 * 
 * @param {RequestAgnostic} req 
 * @param {import('../persistence').PersistenceModule} db 
 * @returns {Promise<ResponseAgnostic>} 
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
        data: {
            success: true,
            data: result
        }
    }
};

/**
 * 
 * 
 * @param {RequestAgnostic} req 
 * @param {import('../persistence').PersistenceModule} db 
 * @returns {Promise<ResponseAgnostic>} 
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
        data: {data: item, success: true}
    }
};

/**
 * 
 * 
 * @param {RequestAgnostic} req 
 * @param {import('../persistence').PersistenceModule} db 
 * @returns {Promise<ResponseAgnostic>} 
 */
async function deleteItem (req, db)  {
    const {id} = req.pathParams || {}

    await db.removeItem(id);

    return {
        statusCode: 204,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            success: true,
            data: id
        }
    }
};

/**
 * 
 * @typedef RequestAgnostic
 * @type {object}
 * @property {string} path
 * @property {string} method
 * @property {{id?: string}} [pathParams]
 * @property {Partial<{max: number, after: string, before: string}>} [queryParams]
 * @property {Partial<{name: string, completed: boolean}>} [body]
 * 
 * 
 * @typedef ResponseAgnostic
 * @type {object}
 * @property {{"Content-Type": string}} headers
 * @property {number} statusCode
 * @property {{success: boolean, data: unknown}} data
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