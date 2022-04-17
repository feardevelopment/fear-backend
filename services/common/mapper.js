
module.exports = {
    
    filterObject: function (raw, allowed) {
        return Object.keys(raw)
            .filter(key => key in allowed)
            .reduce((obj, key) => {
                obj[key] = raw[key]
                return obj
            }, {})
    },

    filterArray: function (array, allowed) {
        return array.map(element => module.exports.filterObject(element, allowed))
    },

    createResponse: function (result, template) {

    }
}