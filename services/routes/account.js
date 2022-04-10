const AUTH_ENDPOINTS = require('../auth.service').ENDPOINTS
const RESPONSES = require('../common/responses.json')
const AUTHORIZATION = require('../common/role.json')
const { using } = require('../common/authorization')


module.exports = {
    async 'POST auth/register'(req, res) {
        const ctx = using(req, res)
        if(!ctx.isAuthorized(AUTHORIZATION.UNAUTHORIZED)) { return }

        const result = await ctx.call(AUTH_ENDPOINTS.REGISTER).with(req.$params).then()

        const response =  (result ? RESPONSES.auth.register.success : RESPONSES.auth.register.failure)
        const stringified = JSON.stringify(response)
        res.end(stringified)
    },

    async 'POST auth/login'(req, res) {
        const ctx = using(req, res)
        if(!ctx.isAuthorized(AUTHORIZATION.UNAUTHORIZED)) { return }

        const result = await ctx.call(AUTH_ENDPOINTS.LOGIN).with(req.$params).then()

        const stringified = JSON.stringify(result)
        res.end(stringified)
    },


    async 'POST auth/device/add/:deviceID'(req, res) {
        const ctx = using(req, res)
        if(!ctx.isAuthorized(AUTHORIZATION.STUDENT)) { return }

        console.log(`Adding new device with ID ${req.$params.deviceID}`)

        const params = {
            deviceID: req.$params.deviceID,
            email: req.$ctx.meta.user.email
        }

        const result = await ctx.call(AUTH_ENDPOINTS.START_DEVICE_ACTIVATION).with(params).then()

        const stringified = JSON.stringify(result)
        res.end(stringified)
    },

    async 'POST auth/device/verify/:flowID'(req, res) {
        const ctx = using(req, res)
        if(!ctx.isAuthorized(AUTHORIZATION.STUDENT)) { return }

        console.log(`Verifying device with flowID ${req.$params.flowID}`)

        const params = {
            flowID: req.$params.flowID,
            token: req.$params.token,
        }
        
        const result = await ctx.call(AUTH_ENDPOINTS.VERIFY_DEVICE_ACTIVATION)
            .with(params)
            .then()

        const response = RESPONSES.auth.verifyDeviceActivation
        response.code = result ? 200 : 500
        response.message = result ? 'success' : 'Wrong token provided!'
        const stringified = JSON.stringify(response)
        res.end(stringified)
    },
}