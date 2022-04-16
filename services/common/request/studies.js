module.exports = {
    newLectureData: {
        name: 'string',
        code: 'string',
        //ID of the lecturer
        lecturer: 'string',
        enrolledBy: { type: 'array', items: 'string' }
    },
    listLectures: {
        codes: { type: 'array', items: 'string'}
    }
}