var bcrypt = require('bcryptjs');
var query = require('./query');

module.exports.auth = function auth(email, pass, cb) {
    findUser(email, function(err, result) {
        var user = null;

        if (result) {
            user = result;
        }

        if (!user) {
            return cb(new Error('Cannot find user'));
        }

        comparePassword(pass, user.password, function(err, isMatch) {
            if (err) return cb(err);
            if (isMatch) {
                return cb(null, user);
            } else {
                cb(new Error('invalid password'));
            }
        });
    });
};


comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
}

function findUser (email, cb) {
  var values = [email];
  var q = 'SELECT id, "restaurantName", email, password FROM "Restaurant" WHERE email = $1';
  
  query(q, values, function (err, result) {
    if (err) {
      return cb(err);
    } else {
      return cb(null, result.rows[0]);
    }
  });
}