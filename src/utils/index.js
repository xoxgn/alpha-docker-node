// @ts-check
const {v4 : uuid} = require('uuid');

const VALID_NAME_MIN_LENGTH = 2
const VALID_ID_MIN_LENGTH = 3

/**
 * @typedef MakerConfiguration
 * @type {object}
 * 
 * @property {"error"} type
 * @property {{statusCode: number, statusMessage: string}} data
 * 
 */

/**
 * 
 * @param {MakerConfiguration} config 
 * @returns {import("../routes").ResponseAgnostic}
 */
function maker(config) {
    return {
        data: {success: false, data: config.data.statusMessage},
        headers: {
            "Content-Type": "application/json",
        },
        statusCode: config.data.statusCode
    }
}

/**
 * @typedef ProcessorParamsCreate
 * @type {object}
 * @property {"create"} type
 * @property {{name?: string, id?: string}} data

 * @typedef ProcessorParamsUpdate
 * @type {object}
 * @property {"update"} type
 * @property {{name?: string, id?: string, completed?: boolean}} data

 * @typedef ProcessorParamsDelete
 * @type {object}
 * @property {"delete"} type
 * @property {{id?: string}} data
 */

/**
 * @overload
 * @param {ProcessorParamsCreate} params
 * @returns {import("../persistence").Item}
 * 
 * @overload
 * @param {ProcessorParamsUpdate} params
 * @returns {import("../persistence").Item}
 * 
 * @overload
 * @param {ProcessorParamsDelete} params
 * @returns {{id: string}}
 * 
 * @param {ProcessorParamsCreate | ProcessorParamsUpdate | ProcessorParamsDelete} params
 */
function processor(params) {
    const {type, data} = params;

    switch (type) {
        case "create": {
            const {
                id = uuid(),
            } = data
            const validName = validateName(data.name);
            
            const item = {
                id,
                name: validName,
                completed: false,
            };

            return item;
        }

        case "update": {
            const validName = validateName(data.name);
            const validCompleted = validateCompletedState(data.completed)
            const validId = validateId(data.id);

            return {
                id: validId,
                name: validName,
                completed: validCompleted
            }
        }
        
        case "delete": {
            const validId = validateId(data.id);

            return {
                id: validId,
            }
        }

        default:
            throw new NeverError(type)
    }


    function validateId(input) {
        if (input == null || typeof input !== "string" || input.length < VALID_ID_MIN_LENGTH) {
            throw new InvalidPropertyError(`A valid ID must be at least ${VALID_ID_MIN_LENGTH} characters long.`)
        }
        return input
    }

    function validateName(input) {
        if (input == null || typeof input !== "string" || input.length < VALID_NAME_MIN_LENGTH) {
            throw new InvalidPropertyError(`A valid name must be at least ${VALID_NAME_MIN_LENGTH} characters long.`)
        }
        return input
    }
    
    function validateCompletedState(input) {
        if (input != null || typeof input !== "boolean") {
            throw new InvalidPropertyError("The 'completed' field can only either be 'null' or a boolean")
        }

        return input ?? false;            
    }
}

class InvalidPropertyError extends Error {
    name = "invalid-property"

    /**
     * 
     * @param {String} msg 
     */
    constructor(msg) {
        super(msg)
    }
}

class NeverError extends Error {
    name = "never-error"

    /**
     * 
     * @param {never} input 
     */
    constructor(input) {
        super(`Unable to process request to '${JSON.stringify(input)}'`)
    }
}

module.exports = {
    maker,
    processor
}