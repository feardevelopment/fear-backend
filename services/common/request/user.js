module.exports = {
    exists: {
        email: 'string'
    },
    get: {
        email: 'string'
    },
    create: {
        email: 'string',
        password:  'string',
        name:  'string'
    },
    addDevice: {
        email: 'string',
        deviceID: 'string',
        secret: 'string'
    },
    enrollLecture: {
        code: 'string',
        user: 'string'
    },
    dropLecture: {
        code: 'string',
        user: 'string'
    }
}