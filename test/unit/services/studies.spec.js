
const { ServiceBroker, Context } = require('moleculer')
const TestService = require('../../../services/studies.service')
const ENDPOINTS = TestService.ENDPOINTS
//const UserService = require('../../../services/user.service')

function getDummyLecture(code) {
     return {
        name: "lecture_name",
        code,
        lecturer: "lecturer_code",
        enrolledBy: ["enrolled_student_code_1", "enrolled_student_code_2",]
    }
}

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


        it('should return only the specified lectures successfully', async () => {
            // Given I register some lectures
            const broker = new ServiceBroker({ logger: false })
            const service = broker.createService(TestService)
            await broker.start()
            const lectureCodes = ['a', 'b', 'c', 'd', 'e']
            const queryCodes = ['a', 'c', 'd']
            for (let code of lectureCodes) {
                const created = await broker.call(ENDPOINTS.CREATE_NEW_LECTURE,  getDummyLecture(code))
                expect(created).toEqual(true)
            }


            // When I try to query some of the registered codes
            const actual = await broker.call(ENDPOINTS.FIND_LECTURES, {codes: queryCodes})

            // Then I should receive only them
            expect(actual.length).toEqual(queryCodes.length)
            for (let i = 0; i < actual.length; i++) {
                expect(queryCodes).toContain(actual[i].code)
            }
            await broker.stop()
        })
    })

})