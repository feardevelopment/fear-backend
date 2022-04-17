const role = require('./role.json')

module.exports = {
   

    using: function(req, res){
        return {
            call: function (endpoint) {
                return {
                    with: function (params) {
                        return{
                            then: async function (callback) {
                                // eslint-disable-next-line no-async-promise-executor, no-unused-vars
                                return new Promise(async (resolve, reject) => {
                                    try {
                                        const response = await req.$service.broker.call(endpoint, params)
                                        let result = response 
                                        if(callback){
                                            result = await callback(response)
                                        }
                                        resolve(result)
                                    } catch (error) {
                                        res.setHeader('Content-Type', 'text/json')
                                        res.writeHead(500)
                                        res.end(JSON.stringify({
                                            message: error.message
                                        }))
                                    }
                                })
                            }
                        }
                    }
                }
            },
            isAuthorized: function(required){
                if(required === role.UNAUTHORIZED) return true
            
                // eslint-disable-next-line
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
            },
        }
    }
} 


function unauthorized() {
    return JSON.stringify({
        'name': 'UnAuthorizedError',
        'message': 'Unauthorized',
        'code': 401,
        'type': 'INVALID_TOKEN'
    })
}

function unauthenticated() {
    return JSON.stringify({
        'name': 'UnAuthorizedError',
        'message': 'Unauthorized',
        'code': 401,
        'type': 'NO_TOKEN'
    })
}