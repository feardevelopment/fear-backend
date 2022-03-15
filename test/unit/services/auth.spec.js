"use strict";

const { ServiceBroker, Context } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../../services/auth.service");
const UserService = require("../../../services/user.service");

const responses = require('../../../commons/responses.json');
const { hash } = require("../../../utils/utils");

const ENDPOINTS = TestService.ENDPOINTS
const USER_ENDPOINTS = UserService.ENDPOINTS

describe("Test actions", () => {

    describe('register', () => {
        it('should return true when registering a non-existing user', async () => {
			// Given
            const expected = true
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            UserService.actions.exists = jest.fn(async () => false);
            UserService.actions.create = jest.fn(async () => null);
            const userService = broker.createService(UserService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.REGISTER, {
                email: "non@existing.user",
                name: 'name',
                password: 'password'
            })

            // Then
            expect(actual).toEqual(expected)
        })

        it('should return false when registering an already existing user', async () => {
			// Given
            const expected = false
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            UserService.actions.exists = jest.fn(async () => true);
            UserService.actions.create = jest.fn(async () => null);
            const userService = broker.createService(UserService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.REGISTER, {
                email: "non@existing.user",
                name: 'name',
                password: 'password'
            })

            // Then
            expect(actual).toEqual(expected)
        })
    })


    describe('login', () => {
        it('should return a failed response when logging in with a non-existing user', async () => {
			// Given
            const expected = responses.auth.login.fail
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            UserService.actions.get = jest.fn(async () => null);
            const userService = broker.createService(UserService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.LOGIN, {
                email: "non@existing.user",
                password: 'password'
            })

            // Then
            expect(actual).toEqual(expected)
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
                email: "non@existing.user",
                password: 'invalid password'
            })

            // Then
            expect(actual).toEqual(expected)
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
                email: "non@existing.user",
                password: 'password'
            })

            // Then
            expect(actual.code).toEqual(expected.code)
            expect(actual.token).not.toBeFalsy()
            expect(actual.token.length).toBeGreaterThan(50)
        })
    })
})

