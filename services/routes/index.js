module.exports = {
    path: '/api',
    whitelist: [
        '**'
    ],
    use: [],
    mergeParams: true,
    authentication: true,
    authorization: false,
    aliases: {
        ...require('./account'),
        ...require('./lecturer')
    },
    autoAliases: false,
    callingOptions: {},
    onBeforeCall(ctx, route, req, res) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
    },
    onError(req, res, err) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.writeHead(500)
        res.end(JSON.stringify(err))
    },
    bodyParsers: {
        json: {
            strict: true,
            limit: '1MB'
        },
        urlencoded: {
            extended: true,
            limit: '1MB'
        }
    },
    mappingPolicy: 'all', // Available values: "all", "restrict"
    logging: true
}
