const STUDIES = require('../studies.service').ENDPOINTS
const RESPONSE = require('../common/response').studies
const REQUESTS = require('../common/request').studies
const AUTHORIZATION = require('../common/role.json')
const { using } = require('../common/authorization')
const { filterObject } = require('../common/mapper')

module.exports = {
    async 'POST lecture/create'(req, res) {
        const ctx = using(req, res)
        if(!ctx.isAuthorized(AUTHORIZATION.ADMIN)) { return }

        const lectureData = filterObject(req.$params, REQUESTS.newLectureData)
        
        const result = await ctx.call(STUDIES.CREATE_NEW_LECTURE).with(lectureData).then()
        res.end(JSON.stringify({result}))
    },


    async 'GET lecture/all'(req, res) {
        const ctx = using(req, res)
        if(!ctx.isAuthorized(AUTHORIZATION.UNAUTHORIZED)) { return }

        const result = await ctx.call(STUDIES.LIST_LECTURES).with().then()  
        const filtered = result.map(element => filterObject(element, RESPONSE.listLectures))

        res.end(JSON.stringify(filtered))
    },


    async 'POST lecture/list'(req, res) {
        const ctx = using(req, res)
        if(!ctx.isAuthorized(AUTHORIZATION.UNAUTHORIZED)) { return }
        
        const result = await ctx.call(STUDIES.FIND_LECTURES).with({code: req.$params.codes}).then()
        const filtered = result.map(element => filterObject(element, RESPONSE.listLectures))

        res.end(JSON.stringify(filtered))
    }
}