var query = require('./query');

module.exports.addRestaurant = function addRestaurant(username, photos, email, password, description, phonenumber, cb){
	var values = [username, photos, email, password, description, phonenumber];
	var q = 'INSERT INTO "Restaurant" (name, photos, email, password, description, phonenumber) VALUES($1, $2, $3, $4, $5, $6)';
	query(q, values, function(err){
		if(err){
			return cb(err);
		}else{
			return cb(null, true);
		}
	});
}
