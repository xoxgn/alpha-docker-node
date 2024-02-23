// @ts-check
const { maker, processor, validateError, GENERIC_ERROR_MESSAGE } = require('../utils');

/**
 * 
 * 
 * @param {RequestAgnostic} req 
 * @param {import('../persistence').PersistenceModule} db 
 * @returns {Promise<ResponseAgnostic>} 
 */
async function addItem(req, db) {
    let receivedBody = req.body;

    if (receivedBody == null) {
        return maker({
            type: "error",
            data: {
                statusCode: 400,
                statusMessage: "Bad Request. No POST body."
            }
        })
    }

    if (typeof receivedBody === "string") {
        try {
            /** @type { Exclude<typeof req.body, string|undefined>} */
            const parsedBody = JSON.parse(receivedBody);

            receivedBody = parsedBody
        } catch (error) {
            return maker({
                type: "error",
                data: {
                    statusCode: 400,
                    statusMessage: "Bad Request. POST body must be valid JSON."
                }
            })
        }
    }

    try {
        const {name} = receivedBody
        const item = processor({type: "create", data: {name}})
    
        await db.storeItem(item);
    
        return {
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: 201, // HTTP Created
            data: {
                success: true,
                data: item
            }
        }

    } catch (error) {
        const checkedError = validateError(error);

        return maker({
            type: "error",
            data: {
                statusCode: 400,
                statusMessage: checkedError ? checkedError.message : GENERIC_ERROR_MESSAGE
            }
        })
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
    const requestPath = req.pathParams || {}
    const requestBody = typeof req.body == "string" 
    // if only a string is received, it will be interpreted as the 'new name'
    ? {
        name: req.body,
        completed: undefined
    }
    : req.body ?? {}

    try {        
        const {completed, id, name} = processor({
            type: "update",
            data: {
                ...requestPath, ...requestBody
            }
        })
    
        await db.updateItem(id, {
            name,
            completed
        });
    
        const item = await db.getItem(id);
    
        return {
            headers: {
                "Content-Type": "application/json"
            },
            statusCode: 200,
            data: {data: item, success: true}
        }
    } catch (error) {
        const checkedError = validateError(error);

        return maker({
            type: "error",
            data: {
                statusCode: 400,
                statusMessage: checkedError ? checkedError.message : GENERIC_ERROR_MESSAGE
            }
        })
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
    try {        
        const {id} = processor({
            type: "delete",
            data: req.pathParams ?? {}
        })
    
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
    } catch (error) {
        const checkedError = validateError(error);

        return maker({
            type: "error",
            data: {
                statusCode: 400,
                statusMessage: checkedError ? checkedError.message : GENERIC_ERROR_MESSAGE
            }
        })
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
 * @property {Partial<{name: string, completed: boolean}> | string} [body]
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