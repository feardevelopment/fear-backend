"use strict";

const requests = require('../commons/requests.json').auth
const responses = require('../commons/responses.json').auth
const USER_ENDPOINTS = require('./user.service').ENDPOINTS
const { generateToken } = require('../utils/utils');
const { hash } = require('../utils/utils')


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const authTokens = {}

module.exports = {
	name: "auth",
    
	settings: {},

    ENDPOINTS: {
        REGISTER: "auth.register",
        LOGIN: "auth.login"
    },

	dependencies: [],

	actions: {
		register: {
			params: requests.register,
			/** @param {Context} ctx  */
			async handler(ctx) {
				const userData = ctx.params
				const exists = await ctx.broker.call(USER_ENDPOINTS.EXISTS, {email: userData.email })
				if(exists){
					return false
				}
                const userCreationRequest = {...userData}
				const hashedPassword = hash(userData.password)
                userCreationRequest.password = hashedPassword
				await ctx.broker.call(USER_ENDPOINTS.CREATE, userCreationRequest)
				return true
			}
		},

		login: {
			params: requests.login,
			/** 
             * @param {Context} ctx 
             */
			async handler(ctx) {
                const user = await ctx.broker.call(USER_ENDPOINTS.GET, {email: ctx.params.email})
                const passwordHash = hash(ctx.params.password)

                if(!user || passwordHash !== user.password) {
                    return responses.login.fail
                }

                if(user.device){
                    const deviceToken = await this.createDeviceToken(user.device)
                    return this.furtherAuthenticationNeeded(deviceToken)
                }

                const token = await this.createAuthToken(user)
                return this.successfulAuthentication(token)
			}
		},
	},

    deviceTokens: {},

	events: {},

	methods: {
        async createDeviceToken(device) {
            const token = await generateToken()
            this.deviceTokens[device] = token
            return token
        },

        async createAuthToken(user) {
            const token = await generateToken()
            authTokens[token] = user
            return token
        },

        furtherAuthenticationNeeded(deviceToken) {
            const response = responses.login['2fa']
            response.loginIdentifier = deviceToken
            return response
        },

        successfulAuthentication(token) {
            const response = responses.login.success
            response.token = token
            return response
        }
    },

	created() {},

	async started() {},

	async stopped() {}
};