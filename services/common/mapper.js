
module.exports = {
    
    filterObject: function (raw, allowed) {
        return Object.keys(raw)
            .filter(key => key in allowed)
            .reduce((obj, key) => {
                obj[key] = raw[key]
                return obj
            }, {})
    },

    createResponse: function (result, template) {

    }
}