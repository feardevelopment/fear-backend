'use strict'

const { ServiceBroker } = require('moleculer')
const TestService = require('../../services/auth.service')
const UserService = require('../../services/user.service')

const ENDPOINTS = TestService.ENDPOINTS
describe('Device flows', () => {

    it('should register a new device successfully', async () => {
        const broker = new ServiceBroker({ logger: false })
        const service = broker.createService(TestService)
        const userService = broker.createService(UserService)
        await broker.start()
        const registerData = {
            email: 'nond@fg.user',
            password: 'pa532sssword',
            name: 'us432ernadme'
        }

        const regresp = await broker.call(ENDPOINTS.REGISTER, registerData)

        const loginRequest = await broker.call(ENDPOINTS.LOGIN, registerData)

        const authToken = loginRequest.token
        // start device registration
        const deviceRegistrationData = {
            email: registerData.email,
            deviceID: '111111-222222'
        }
        const deviceActivationRequest = await broker.call(ENDPOINTS.START_DEVICE_ACTIVATION, deviceRegistrationData)

        const token = '000-000'
        const verifyDeviceActivationRequestData = {
            flowID: deviceActivationRequest.flowID,
            token
        }
        const verifyDeviceActivationRequest = await broker.call(ENDPOINTS.VERIFY_DEVICE_ACTIVATION, verifyDeviceActivationRequestData)

        expect(verifyDeviceActivationRequest).toBeTruthy()

        const loginRequestWithDevice = await broker.call(ENDPOINTS.LOGIN, registerData)
            
        expect(loginRequestWithDevice.code).toEqual(202)
        expect(loginRequestWithDevice).toHaveProperty('flowID')
        await broker.stop()
            
    })
})
