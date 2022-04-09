
const ApiGateway = require('moleculer-web')
const role = require('./role.json')

module.exports = {
    isAuthorized: function(req, res, required){
        if(required === role.UNAUTHORIZED) return true
    
        if(!req.$ctx?.meta?.user?.authorization) {
            res.end(unauthenticated())
            return false
        }
        
        const actual = req.$ctx.meta.user.authorization
        if(actual < required){
            res.end(unauthorized())
            return false
        }
    
        return true
    }
} 


function unauthorized() {
    return JSON.stringify({
        "name": "UnAuthorizedError",
        "message": "Unauthorized",
        "code": 401,
        "type": "INVALID_TOKEN"
    })
}

function unauthenticated() {
    return JSON.stringify({
        "name": "UnAuthorizedError",
        "message": "Unauthorized",
        "code": 401,
        "type": "NO_TOKEN"
    })
}