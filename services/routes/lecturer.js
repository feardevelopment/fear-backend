
const AUTH_ENDPOINTS = require('../auth.service').ENDPOINTS

const RESPONSES = require('../common/responses.json')

const AUTHORIZATION = require('../common/role')
const { isAuthorized } = require('../common/authorization')

module.exports = {    
    async 'POST auth/test'(req, res) {
        if(!isAuthorized(req, res, AUTHORIZATION.UNAUTHORIZED)) { return }

        const result = await req.$service.broker.call(AUTH_ENDPOINTS.LOGIN, req.$params)
        const stringified = JSON.stringify(result)
        res.end(stringified)
    },
}