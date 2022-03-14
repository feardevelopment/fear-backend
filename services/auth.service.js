"use strict";

const requests = require('../commons/requests.json').auth
const { hash } = require('./utils/utils')


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "auth",
    
	settings: {},

	dependencies: [],

	actions: {
		register: {
			params: requests.register,
			/** @param {Context} ctx  */
			async handler(ctx) {
				const userData = ctx.params
				const exists = ctx.broker.call('user.exists', userData.email)
				if(exists){
					return false
				}
				const hashedPassword = hash(userData.password)
                userData.password = hashedPassword
				await ctx.broker.call('user.create', userData)
				return true
			}
		},

		login: {
			params: requests.login,
			/** @param {Context} ctx  */
			async handler(ctx) {
                ctx.params.password = hash(ctx.params.password)
                return ctx.params
			}
		},
	},

	events: {},

	methods: {},

	created() {},

	async started() {},

	async stopped() {}
};