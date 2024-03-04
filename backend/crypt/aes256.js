const crypto = require('crypto')

const algorithm = 'aes-256-cbc';
const key = 'abcdefghijklmnopqrstuvwxyz123456';

module.exports = {
    encrypt: function(plainText) {
        const iv = Buffer.alloc(16,0); 
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encryptedText = cipher.update(plainText, 'utf8', 'base64');
        encryptedText += cipher.final('base64');
        return encryptedText;
    },

    decrypt: function(cipherText) {
        const iv = Buffer.alloc(16,0); 
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let plainText = decipher.update(cipherText, 'base64', 'utf8');
        plainText += decipher.final('utf8');
        return plainText;
    }
}

