module.exports = {
    register:{
        email: 'string',
        password:  'string',
        name:  'string'
    },
    login: {
        email: 'string',
        password:  'string'
    },
    verify: {
        token: 'string'
    },
    verifyLogin: {
        flowID: 'string',
        token: 'string'
    },
    startDeviceActivation: {
        email: 'string',
        deviceID: 'string'
    },
    verifyDeviceActivation:{
        token:'string',
        flowID: 'string'
    }
}