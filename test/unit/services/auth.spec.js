'use strict'

const { ServiceBroker, Context } = require('moleculer')
const { ValidationError } = require('moleculer').Errors
const TestService = require('../../../services/auth.service')
const UserService = require('../../../services/user.service')

const responses = require('../../../services/common/responses.json')
const { hash } = require('../../../utils/utils')

const ENDPOINTS = TestService.ENDPOINTS

describe('Test actions', () => {


    describe('register', () => {
        it('should return true when registering a non-existing user', async () => {
            // Given
            const expected = true
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            UserService.actions.exists = jest.fn(async () => false)
            UserService.actions.create = jest.fn(async () => null)
            const userService = broker.createService(UserService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.REGISTER, {
                email: 't4non@exist2ing.user',
                name: 'name',
                password: 'password'
            })

            // Then
            expect(actual).toEqual(expected)
            await broker.stop()
        })

        it('should return false when registering an already existing user', async () => {
            // Given
            const expected = false
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            UserService.actions.exists = jest.fn(async () => true)
            UserService.actions.create = jest.fn(async () => null)
            const userService = broker.createService(UserService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.REGISTER, {
                email: 'qenon@existirtng.user',
                name: 'name',
                password: 'password'
            })

            // Then
            expect(actual).toEqual(expected)
            await broker.stop()
        })
    })


    describe('login', () => {
        it('should return a failed response when logging in with a non-existing user', async () => {
            // Given
            const expected = responses.auth.login.fail
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            UserService.actions.get = jest.fn(async () => null)
            const userService = broker.createService(UserService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.LOGIN, {
                email: 'nown@existirwng.user',
                password: 'password'
            })

            // Then
            expect(actual).toEqual(expected)
            await broker.stop()
        })

        it('should return a failed response when logging in with an invalid password', async () => {
            // Given
            const expected = responses.auth.login.fail
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            UserService.actions.getUser = jest.fn(async () => Promise.resolve({
                name: 'name',
                password: hash('password'),
                email: 'email'
            }))
            const userService = broker.createService(UserService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.LOGIN, {
                email: 'nofn@existinga.user',
                password: 'invalid password'
            })

            // Then
            expect(actual).toEqual(expected)
            await broker.stop()
        })

        it('should return a successful response when logging in with valid credentials', async () => {
            // Given
            const expected = responses.auth.login.success
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            UserService.actions.getUser = jest.fn(async () => Promise.resolve({
                name: 'name',
                password: hash('password'),
                email: 'email'
            }))
            const userService = broker.createService(UserService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.LOGIN, {
                email: 'nson@existidng.user',
                password: 'password'
            })

            // Then
            expect(actual.code).toEqual(expected.code)
            expect(actual.token).not.toBeFalsy()
            expect(actual.token.length).toBeGreaterThan(50)
            await broker.stop()
        })

        it('should return a further authentication request when logging in with a user that has a device', async () => {
            // Given
            const expected = responses.auth.login['2fa']
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            UserService.actions.getUser = jest.fn(async () => Promise.resolve({
                name: 'name',
                password: hash('password'),
                email: 'email',
                device: 'some device ID'
            }))
            const userService = broker.createService(UserService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.LOGIN, {
                email: 'non@exisdtings.user',
                password: 'password'
            })

            // Then
            expect(actual.code).toEqual(expected.code)
            expect(actual.flowID).not.toBeFalsy()
            expect(actual.flowID.length).toBeGreaterThan(10)
            await broker.stop()
        })
    })
})

