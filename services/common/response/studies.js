module.exports = {
    listLectures: {
        name: 'string',
        code: 'string',
        lecturer: 'string',
        enrolledBy: { type: 'array', items: 'string', default: ['user'] }
    },
    findLecture: {
        name: 'string',
        code: 'string',
        lecturer: 'string',
        enrolledBy: { type: 'array', items: 'string', default: ['user'] }
    }
}