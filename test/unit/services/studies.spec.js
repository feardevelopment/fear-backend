
const { ServiceBroker, Context } = require('moleculer')
const TestService = require('../../../services/studies.service')
const ENDPOINTS = TestService.ENDPOINTS
//const UserService = require('../../../services/user.service')


describe('Test actions', () => {
    describe('create new lecture', () => {
        it('should return true when registering a non-existing lecture', async () => {
            // Given
            const expected = true
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            await broker.start()

            // When
            const actual = await broker.call(ENDPOINTS.CREATE_NEW_LECTURE, {
                name: "lecture_name",
                code: "lecture_codee",
                lecturer: "lecturer_code",
                enrolledBy: ["enrolled_student_code_1", "enrolled_student_code_2",]
            })

            // Then
            expect(actual).toEqual(expected)
            await broker.stop()
        })

        it('should return false when registering an already existing lecture', async () => {
            // Given I register a non-existing lecture
            const expected = false
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            await broker.start()
            const created = await broker.call(ENDPOINTS.CREATE_NEW_LECTURE, {
                name: "lecture_name",
                code: "lecture_codee",
                lecturer: "lecturer_code",
                enrolledBy: ["enrolled_student_code_1", "enrolled_student_code_2",]
            })
            expect(created).toEqual(true)


            // When I try to re-register the same lecture
            const actual = await broker.call(ENDPOINTS.CREATE_NEW_LECTURE, {
                name: "lecture_name",
                code: "lecture_codee",
                lecturer: "lecturer_code",
                enrolledBy: ["enrolled_student_code_1", "enrolled_student_code_2",]
            })

            // Then I should receive a false value
            expect(actual).toEqual(expected)
            await broker.stop()
        })
    })

})