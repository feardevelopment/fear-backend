
const crypto = require('crypto')
const HASH_ALGORITHM = 'sha256'

module.exports = {
    hash(plaintext){
        return crypto.createHash(HASH_ALGORITHM).update(plaintext).digest('hex');
    },
    
    generateToken() {
        const buffer = crypto.randomBytes(48);
        return buffer.toString('hex')
    }
}