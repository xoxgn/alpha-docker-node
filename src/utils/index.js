// @ts-check

/**
 * @typedef Utilities
 * @type {object}
 * 
 * @property {(config: {type: "error", data: {statusCode: number, statusMessage: string}}) => import("../routes").ResponseAgnostic} maker
 */

/** @type {Utilities} */
const definition = {
    maker: function (config) {

        return {
            data: config.data.statusMessage,
            headers: {
                "Content-Type": "application/json",
            },
            statusCode: config.data.statusCode
        }
    }
}

module.exports = definition