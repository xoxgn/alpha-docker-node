if (process.env.POSTGRES_HOST) module.exports = require('./postgres');
else module.exports = require('./sqlite');

/**
 * @typedef PersistenceModule
 * @type {object}
 * 
 * @property {() => Promise<void>} init
 * @property {() => Promise<void>} teardown
 * @property {() => Promise<Item[]>} getItems
 * @property {(id: string) => Promise<Item>} getItem
 * @property {(item: Item) => Promise<void>} storeItem
 * @property {(id: string, item: Omit<Item, "id">) => Promise<void>} updateItem
 * @property {(id: string) => Promise<number>} removeItem
 */

/**
 * @typedef Item
 * @type {object}
 * 
 * @property {boolean} completed
 * @property {string} id
 * @property {string} name
 */