'use strict'

const { ServiceBroker, Context } = require('moleculer')
const { ValidationError } = require('moleculer').Errors
const TestService = require('../../../services/user.service')

const ENDPOINTS = TestService.ENDPOINTS

describe('Test actions', () => {
    const broker = new ServiceBroker({ logger: false })
    const service = broker.createService(TestService)
    jest.spyOn(service.adapter, 'findOne')
    jest.spyOn(service.adapter, 'insert')
    
    beforeAll(() => broker.start())
    afterAll(() => broker.stop())
    describe('exists', () => {
        it('should return false when asked for a non-existing user', async () => {
            // Given
            const expected = false
            service.adapter.findOne.mockImplementation(async () => null)
            const email = 'non@existing.user'
            // When
            const actual = await broker.call(ENDPOINTS.EXISTS, {email: email})
            // Then
            expect(actual).toEqual(expected)
        })

        it('should return true when asked for an existing user', async () => {
            // Given
            const expected = true
            service.adapter.findOne.mockImplementation(async () => true)
            const email = 'non@existing.user'
            // When
            const actual = await broker.call(ENDPOINTS.EXISTS, {email: email})
            // Then
            expect(actual).toEqual(expected)
        })
    })

    describe('create', () => {
        it('should call insert function', async () => {
            // Given
            service.adapter.insert.mockImplementation(async () => null)
            const email = 'non@existing.user'
            // When
            await broker.call(ENDPOINTS.CREATE, {
                email: email,
                password: 'password',
                name: 'name'
            })

            // Then
            expect(service.adapter.insert).toHaveBeenCalled()
        })
    })
})

