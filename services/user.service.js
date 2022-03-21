'use strict'

const requests = require('../commons/requests.json').user

const DbMixin = require('../mixins/db.mixin')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: 'user',

    ENDPOINTS: {
        EXISTS: 'user.exists',
        CREATE: 'user.create',
        GET: 'user.getUser',
        ADD_DEVICE: 'user.addDevice'
    },
    
    mixins: [DbMixin('user')],

    dependencies: [],

    settings: {
        
        idField: 'email',

        entityValidator: {
            email: 'string|min:3',
            password: 'string|min:3'
        }
    },


    actions: {
        exists:{
            params: requests.exists,
            /** @param {Context} ctx  */
            async handler(ctx) {
                const user = await this.adapter.findOne({email: ctx.params.email})
                return !!user
            }
        },
        create:{
            params: requests.create,
            /** @param {Context} ctx  */
            async handler(ctx) {
                await this.adapter.insert(ctx.params)
            }
        },
        getUser:{
            params: requests.get,
            /** @param {Context} ctx  */
            async handler(ctx) {
                return this.adapter.findOne({email: ctx.params.email})
            }
        },
		addDevice: {
			params: requests.addDevice,
			/** @param {Context} ctx */
			async handler(ctx) {
				return this.adapter.update({email: ctx.params.email}, {device: {deviceID: ctx.params.deviceID, secret: ctx.params.secret}})
			}
		}
    },

    events: {},

    methods: {},

    created() {},

    async started() {},

    async stopped() {},
    
    async afterConnected() {
        // await this.adapter.collection.createIndex({ name: 1 });
    }
}