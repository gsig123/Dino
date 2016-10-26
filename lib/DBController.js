var query = require('./query');
var bcrypt = require('bcryptjs');


/* 
* Create User With Hash Function - Creates a row in Restaurant table and in Branches Table
*
* @param {object} newUser - newUser object. Includes restaurantName(String), email(String), hashed password(String), phonenumber(Int), 
* website(String), address(String), city(String), postalCode(Int), description(String) and image(String).
* @param {function} callback - The callback function.
* @return {function} Returns callback function with errors or result. 
*/
createUserWithHash = function(newUser, callback){

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

	// Query string for Restaurant table INSERT
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

			// Create row in Branches table with the restId
			createBranch(values, callback);

			// All good. Return from query function
			return callback(null, true);
		}
	});
}


/* 
* Create Branch Function- Adds INSERTS a row into Branches table
*
* @param {object} values - Values to insert: (restId, address, postal, city)
* @param {function} callback - The callback function.
* @return {function} Returns callback function with errors or result. 
*/
createBranch = function(values, callback){

	// Query string for Branches table INSERT
	q = 'INSERT INTO "Branches" ("restId", address, postal, city) VALUES($1, $2, $3, $4)';

	// Run the query, INSERTS into Branches table
	query(q, values, function(err){
		if(err){
			return callback(err);
		} else {

			// Everything good - Return from query function.
			return callback(null, true);
		}
	});
}


/* 
* Create User Function - Hashes the password and then creates a row in Restaurant table and in Branches Table. 
*
* @param {object} newUser - newUser object. Includes restaurantName(String), email(String), password(String), phonenumber(Int), 
* website(String), address(String), city(String), postalCode(Int), description(String) and image(String).
* @param {function} callback - The callback function.
* @return {function} Returns callback function with errors or result. 
*/
module.exports.createUser = function(newUser, callback){
	// Hash and salt the password
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			// Error handler
			if(err) throw err;
			// Set the password in the newUser object as hashed password
			newUser.password = hash; 
			// Create rows in DB
			createUserWithHash(newUser, callback);
		});
	});
}

