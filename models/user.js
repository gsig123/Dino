var query = require('../lib/query');



/* 
* Create User Function
*
* @param {object} newUser - newUser object. Includes restaurantName(String), email(String), password(String), phonenumber(Int), 
* website(String), address(String), city(String), postalCode(Int), description(String) and image(String).
* @param {function} callback - The callback function.
* @return {function} Returns callback function with errors or result. 
*/
module.exports.createUser = function(newUser, callback){

	// Get values from newUser object
	var restaurantName = newUser.restaurantName;
	var email = newUser.email;
	var password = newUser.password;
	var phonenumber = newUser.phonenumber;
	var website = newUser.website;
	var address = newUser.address;
	var city = newUser.city;
	var postalCode = newUser.postalCode;
	var description = newUser.description;
	var image = newUser.image;

	// Values for Restaurant table
	var values = [
	restaurantName,
	image, 
	email,
	password, 
	description,
	phonenumber,
	website
	];

	// Query for Restaurant table INSERT
	var q = 'INSERT INTO "Restaurant" ("restaurantName", image, email, password, description, phonenumber, website) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id';

	// Call the query function to add to Restaurant table and also Branches table
	query(q, values, function(err, result){

		// Check for errors
		if(err){
			return callback(err);
		}else{

			// Values added to restaurant table, get the id from the restaurant row
			var restId = result.rows[0].id;

			// Values for Branches table
			values = [restId, address, postalCode, city];

			// Query for Branches table INSERT
			q = 'INSERT INTO "Branches" ("restId", address, postal, city) VALUES($1, $2, $3, $4)';

			// Run second query. This one INSERTS into Branches table.
			query(q, values, function(err){
				if(err){
					return callback(err);
				} else {
					// Everything good - Return from second query function.
					return callback(null, true);
				}
			});

			// All good. Return from first query function.
			return callback(null, true);
		}



	});

}