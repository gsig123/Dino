var DBController = require('../lib/DBController');

module.exports.login = function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  DBController.auth(email, password, function(err, user) {
    if (user) {
      // If user exist we add it to the request.
      req.user = user;
      next();
    } else {
      // Else we simply call next (user will be null in the request). 
      next();
    }
  });
}
