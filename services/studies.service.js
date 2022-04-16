'use strict'

const requests = require('./common/request').studies

const DbMixin = require('../mixins/db.mixin')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: 'studies',
    ENDPOINTS: {
        CREATE_NEW_LECTURE: 'studies.createNewLecture',
        LIST_LECTURES: 'studies.listLectures',
        FIND_LECTURES: 'studies.findLectures'
    },
    settings: {},

    mixins: [DbMixin('studies')],

    dependencies: [],

    actions: {
        createNewLecture: {
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
        listLectures: {
            async handler() {                
                return this.adapter.find({})
            }
        },
        findLectures: {
            params: requests.findLectures,
            /** @param {Context} ctx  */
            async handler(ctx) {
                return this.adapter.find({code: ctx.params.codes})
            }
        }
    },

    events: {},

    methods: {},

    created() {},

    async started() {},

    async stopped() {}
}