'use strict'

const ApiGateway = require('moleculer-web')

const AUTH_ENDPOINTS = require('./auth.service').ENDPOINTS
const role = require('./common/role.json')

const routes = require('./routes')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
    name: 'api',
    mixins: [ApiGateway],

    // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
    settings: {
        // Exposed port
        port: process.env.PORT || 3000,

        // Exposed IP
        ip: '0.0.0.0',

        // Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [
            // eslint-disable-next-line no-unused-vars
            function(err, req, res, next) {
                this.logger.error('Error is occured in middlewares!')
                this.sendError(req, res, err)
            }
        ],

        routes: [routes],

        // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
        log4XXResponses: false,
        // Logging the request parameters. Set to any log level to enable it. E.g. "info"
        logRequestParams: null,
        // Logging the response data. Set to any log level to enable it. E.g. "info"
        logResponseData: null,


        // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
        assets: {
            folder: 'public',

            // Options to `server-static` module
            options: {}
        },
        onError(req, res, err) {
            res.setHeader('Content-Type', 'text/plain')
            res.writeHead(501)
            res.end('Global error: ' + err.message)
        }
    },


    methods: {

        /**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
        async authenticate(ctx, route, req) {
            const token = req.headers['authorization']
            if(token){
                if (token == 'Bearer 123456') {
                    // Returns the resolved user. It will be set to the `ctx.meta.user`
                    return { id: 55555, name: 'John Doe', authorization: role.ADMIN }
                }
                const user = await ctx.broker.call(AUTH_ENDPOINTS.VERIFY, {token})
                return user
            }
            return null
        },
    }
}
