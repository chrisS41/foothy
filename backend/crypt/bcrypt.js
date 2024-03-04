const bcrypt = require('bcrypt');

// -------------------------------------------------------------
// Asynchronous version of bcrypt, likely to be shipped

module.exports = {
    makeSalt: function(numberOfRounds) {
        return new Promise((success,failure) => {
            bcrypt.genSalt(numberOfRounds, function(error, salt){
                if(error)
                    failure(error);
                else
                {
                    success({
                        salt: salt
                    });
                }
            });
        });
    },

    makeHash: function(password, salt) {
        return new Promise((success,failure) => {
            bcrypt.hash(password, salt, function(error, hash){
                if(error)
                    failure(error);
                else{
                    success({
                        hash: hash
                    })
                }
            })
        })
    }
}