const AUTH_ENDPOINTS = require('../auth.service').ENDPOINTS
const RESPONSES = require('../common/responses.json')
const AUTHORIZATION = require('../common/role.json')
const { isAuthorized } = require('../common/authorization')


module.exports = {
    async 'POST auth/register'(req, res) {
        if(!isAuthorized(req, res, AUTHORIZATION.UNAUTHORIZED)) { return }

        const result = await req.$service.broker.call(AUTH_ENDPOINTS.REGISTER, req.$params)

        const response =  (result ? RESPONSES.auth.register.success : RESPONSES.auth.register.failure)
        const stringified = JSON.stringify(response)
        res.end(stringified)
    },

    async 'POST auth/login'(req, res) {
        if(!isAuthorized(req, res, AUTHORIZATION.UNAUTHORIZED)) { return }

        const result = await req.$service.broker.call(AUTH_ENDPOINTS.LOGIN, req.$params)

        const stringified = JSON.stringify(result)
        res.end(stringified)
    },


    async 'POST auth/device/add/:deviceID'(req, res) {
        if(!isAuthorized(req, res, AUTHORIZATION.STUDENT)) { return }

        console.log(`Adding new device with ID ${req.$params.deviceID}`)

        const params = {
            deviceID: req.$params.deviceID,
            email: req.$ctx.meta.user.email
        }

        const result = await req.$service.broker.call(AUTH_ENDPOINTS.START_DEVICE_ACTIVATION, params)

        const stringified = JSON.stringify(result)
        res.end(stringified)
    },
}