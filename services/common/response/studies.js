module.exports = {
    listLectures: {
        name: 'string',
        code: 'string',
        //ID of the lecturer
        lecturer: 'string',
        enrolledBy: { type: 'array', items: 'string', default: ['user'] }
    }
}