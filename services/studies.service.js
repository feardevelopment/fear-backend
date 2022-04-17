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
        FIND_LECTURES: 'studies.findLectures',
        ENROLL_LECTURE: 'studies.enrollLecture',
        DROP_LECTURE: 'studies.dropLecture'
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
                return this.adapter.find({query: {code: {$in: ctx.params.codes}}})
            }
        },
        enrollLecture: {
            params: requests.enrollLecture,
            /** @param {Context} ctx */
            async handler(ctx) {
                const lecture = await this.adapter.findOne({code: ctx.params.code})

                if(!lecture){
                    throw new Error('No lecture exists by id ' + ctx.params.code)
                }
                console.log(lecture)

                if(!lecture.enrolledBy.includes(ctx.params.user)){
                    lecture.enrolledBy.push(ctx.params.user)
                }

                return this.adapter.updateById(lecture._id, lecture)
            }
        },
        dropLecture: {
            params: requests.dropLecture,
            /** @param {Context} ctx */
            async handler(ctx) {
                const lecture = await this.adapter.findOne({code: ctx.params.code})

                if(!lecture){
                    throw new Error('No lecture exists by id ' + ctx.params.code)
                }
                
                const students = new Set(lecture.enrolledBy)

                if(students.has(ctx.params.user)) {
                    students.delete(ctx.params.user)
                    lecture.enrolledBy = Array.from(students)
                }
                
                return this.adapter.updateById(lecture._id, lecture)
            }
        }
    },

    events: {},

    methods: {},

    created() {},

    async started() {},

    async stopped() {}
}