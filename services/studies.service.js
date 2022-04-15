'use strict'

const requests = require('./common/request').studies

const DbMixin = require('../mixins/db.mixin')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: 'studies',
    ENDPOINTS: {
        CREATE_NEW_LECTURE: 'studies.createNewLecture'
    },
    settings: {},

    mixins: [DbMixin('studies')],

    dependencies: [],

    actions: {
        createNewLecture:{
            params: requests.newLectureData,
            /** @param {Context} ctx  */
            async handler(ctx) {
                const lecture = await this.adapter.findOne({code: ctx.params.code})
                
                if(lecture){
                    return false
                }
                
                await this.adapter.insert(ctx.params)
                return true
            }
        },
    },

    events: {},

    methods: {},

    created() {},

    async started() {},

    async stopped() {}
}