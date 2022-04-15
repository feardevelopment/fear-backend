'use strict'

const requests = require('./common/request').auth
const responses = require('./common/response').auth

const USER_ENDPOINTS = require('./user.service').ENDPOINTS

const { generateToken } = require('../utils/utils')
const { hash } = require('../utils/utils')
const role = require('./common/role.json')


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const authTokens = {}
const deviceTokens = {}
const deviceRegistrations= {}


module.exports = {
    name: 'auth',
    
    settings: {},

    ENDPOINTS: {
        REGISTER: 'auth.register',
        LOGIN: 'auth.login',
        VERIFY: 'auth.verify',
        VERIFY_LOGIN: 'auth.verifyLogin',
        START_DEVICE_ACTIVATION: 'auth.startDeviceActivation',
        VERIFY_DEVICE_ACTIVATION: 'auth.verifyDeviceActivation'
    },

    dependencies: [],

    actions: {
        register: {
            params: requests.register,
            /** @param {Context} ctx  */
            async handler(ctx) {
                console.log(`Registering user with email ${ctx.params.email}`)
                
                const userData = ctx.params
                const exists = await ctx.broker.call(USER_ENDPOINTS.EXISTS, {email: userData.email })

                if(exists){
                    console.log(`User already exists with email ${userData.email}`)
                    return false
                }

                const userCreationRequest = {...userData}
                const hashedPassword = hash(userData.password)
                userCreationRequest.password = hashedPassword
                userCreationRequest.authorization = role.ADMIN

                await ctx.broker.call(USER_ENDPOINTS.CREATE, userCreationRequest)
                return true
            }
        },

        login: {
            params: requests.login,
            /** 
             * @param {Context} ctx 
             */
            async handler(ctx) {
                console.log(`Logging in with ${ctx.params.email}`)
                const user = await ctx.broker.call(USER_ENDPOINTS.GET, {email: ctx.params.email})
                const passwordHash = hash(ctx.params.password)

                if(!user || passwordHash !== user.password) {
                    console.log(`User not exists with email ${ctx.params.email}, or Password is not matching`)
                    return responses.login.fail
                }

                if(user.device){
                    console.log(`Creating 2FA login flow with device id ${user.device}`)
                    const deviceToken = await this.createDeviceToken(user.device, user)
                    return this.furtherAuthenticationNeeded(deviceToken)
                }

                console.log(`Login successful, creating token for ${user.email}`)
                const token = await this.createAuthToken(user)
                return this.successfulAuthentication(token)
            }
        },


        verify: {
            params: requests.verify,
            /** 
             * @param {Context} ctx 
             */
            async handler(ctx) {
                const user = authTokens[ctx.params.token]
                return user || null
            }
        },

        verifyLogin: {
            params: requests.verifyLogin,
            /** 
             * @param {Context} ctx 
             */
            async handler(ctx) {
                const params = ctx.params
                const secret = deviceTokens[params.flowID].device.secret
                if(this.validateToken(params.token, secret)){
                    const user = deviceTokens[params.flowID].user
                    const token = await this.createAuthToken(user)
                    return this.successfulAuthentication(token)
                }
                return responses.login.fail
            }
        },

        startDeviceActivation: {
            params: requests.startDeviceActivation,
            /** 
             * @param {Context} ctx 
             */
            async handler(ctx) {
                const device = ctx.params

                return this.startDeviceActivationFlow(device)
                /**
                 * create and respond a secret (totp) and an identifier. (to be used at verifyDeviceActivation)
                 */
            }
        },

        verifyDeviceActivation: {
            params: requests.verifyDeviceActivation,
            /** 
             * @param {Context} ctx 
             */
            async handler(ctx) {
                const params = ctx.params
                const activationFlow = deviceRegistrations[params.flowID]

                if(!activationFlow){
                    throw new Error('no activation flow found by identifier' + params.flowID)
                }

                const isValidToken = await this.validateToken(params.token, activationFlow.secret)
                if(!isValidToken){
                    return false
                }

                const device = {
                    secret: activationFlow.secret,
                    ...activationFlow.device
                }
                 
                await ctx.broker.call(USER_ENDPOINTS.ADD_DEVICE, device)
                delete deviceRegistrations[params.flowID]
                return true
            }
        },


    },
    

    events: {},

    methods: {
        async createDeviceToken(device, user) {
            const token = await generateToken()
            deviceTokens[token] = {
                token,
                device,
                user
            }  
            return token
        },

        async createAuthToken(user) {
            const token = await generateToken()
            authTokens[token] = user
            return token
        },

        furtherAuthenticationNeeded(deviceToken) {
            const response = responses.login['2fa']
            response.flowID = deviceToken
            return response
        },

        successfulAuthentication(token) {
            const response = responses.login.success
            response.token = token
            return response
        },

        async startDeviceActivationFlow(device){
            const identifier = await generateToken()
            deviceRegistrations[identifier] = {
                secret: 'secret',
                device: device
            }
            return {
                flowID: identifier,
                secret: 'secret'
            }
        },

        // eslint-disable-next-line no-unused-vars
        async validateToken(token, secret){
            return token === '000-000'
        },

    },

    created() {},

    async started() {},

    async stopped() {}
}