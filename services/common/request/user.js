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
    }
}