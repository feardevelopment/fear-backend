const STUDIES = require('../studies.service').ENDPOINTS
const RESPONSES = require('../common/response')
const REQUESTS = require('../common/request').studies
const AUTHORIZATION = require('../common/role.json')
const { using } = require('../common/authorization')
const { filterObject } = require('../common/mapper')

module.exports = {
    async 'POST lecture/create'(req, res) {
        const ctx = using(req, res)
        if(!ctx.isAuthorized(AUTHORIZATION.UNAUTHORIZED)) { return }

        const lectureData = filterObject(req.$params, REQUESTS.newLectureData)
        
        const result = await ctx.call(STUDIES.CREATE_NEW_LECTURE).with(lectureData).then()
        res.end(JSON.stringify({result}))
    }
}