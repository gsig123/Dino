var query = require('./query');
var bcrypt = require('bcryptjs');
// A neat package to do the queries
var query2 = require('pg-query');
query2.connectionParameters = 'postgres://ojofftkgraowbe:58x4ZrQADy4bkQ_dOaGE_PQw0k@ec2-54-75-232-54.eu-west-1.compute.amazonaws.com:5432/df70gei51qcp3s';

// Test promises
var when = require('when');


/*
* Create User With Hash - INSERTS a row in Restaurant table and in Branches Table
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
* Create Branch - INSERTS a row into Branches table
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
* Create User - Hashes the password and then creates a row in Restaurant table and in Branches Table.
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


/*
* Create Offer - Creates an offer row in DB
*
* @param {object} New offer
* @param {function} callback - The callback function.
* @return {function} Returns callback function with error or user
*/
module.exports.createOffer = function(newOffer, callback){

	// Values to add to offers table
	var values = [
	newOffer.restName,
	newOffer.offerName,
	newOffer.type,
	newOffer.price,
	newOffer.description,
	newOffer.startDate,
	newOffer.endDate,
	newOffer.offerImageName,
	newOffer.restId,
	newOffer.timeFrom,
	newOffer.timeTo,
	newOffer.weekdays
	];

	// Query string
	var q = 'INSERT INTO "Offers" ("restName", name, type, price, description, "startDate", "endDate", photo, "restId", "timeFrom", "timeTo", weekdays) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id';

	// Call the query function to add to Offers table
	query(q, values, function(err, result){
		// Check for errors
		if(err){
			return callback(err);
		} else {
			// Values added to the offers table, get the id from the offers row
			var offerId = result.rows[0].id;

			return callback(null, true);
		}
	});
}

/*
* Auth - Takes in user and password and compares it with values from DB
*
* @param {String} email - Email to check out
* @param {String} password - Not hashed pw to compare with hashed pw.
* @param {function} callback - The callback function.
* @return {function} Returns callback function with error or user
*/
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

/*
* ComparePassword - Takes in unhashed password and password hash and compares them.
*
* @param {String} candidatePassword - Pw to compare with hash
* @param {String} hash - Hash to compare with pw
* @param {function} callback - The callback function.
* @return {function} Returns callback function with isMatch if it is a match
*/
comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
}

/*
* FindUser - Tries to find user by email address in DB
*
* @param {String} email - Email to search by
* @param {function} callback - The callback function.
* @return {function} Returns callback function with error or the user.
*/
findUser = function(email, cb) {
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

/////////////////////////////
/// Very Bad Search Function
////////////////////////////
module.exports.getAllOffers = function(cb){

	var q = 'SELECT * FROM "Offers"';
	var values = [];
	return query2(q, values, cb);
}

module.exports.getOffers = function(searchQuery, cb) {
	query(searchQuery.queryString, searchQuery.values, function(err, result){
		if (err) {throw err;
		} 
		cb(null, result);
	});
}


/*
* FindAllUserInfo - find all users infomation in DB (used to get infomation of users in admin page)
* @param {string} email - Email to search by
* @param {function} callback - The callback function.
* @return {function} Returns callback function with error or the user infomation.
*/
module.exports.findAllUserInfo = function(email,cb) {
  var values = [email];
  var q = 'SELECT "restaurantName", "image", "description", "phonenumber", "website"  FROM "Restaurant" WHERE email = $1';

  query(q, values, function (err, result) {
    if (err) {
      return cb(err);
    } else {
      return cb(null, result.rows[0]);
    }
  });
}

module.exports.getRestaurantById = function(id, cb){
	var values = [id];
	var q = 'SELECT "restaurantName", "image", "description", "phonenumber", "website" FROM "Restaurant" WHERE id = $1';

	query(q, values, function(err, result){
		if(err){
			return cb(err);
		} else {
			return cb(null, result.rows[0]);
		}
	});
}

module.exports.getOffersByRestId = function(restId, cb){
	var values = [restId];
	var q = 'SELECT * FROM "Offers" WHERE "restId" = $1';

	query(q, values, function(err, result){
		if(err){
			return cb(err);
		} else {
			return cb(null, result.rows);
		}
	});
}


module.exports.getRestaurantBranchesByRestId = function(restId, cb){
	var values = [restId];
	var q = 'SELECT * FROM "Branches" WHERE "restId" = $1';

	query(q, values, function(err, result){
		if(err) return cb(err);
		return cb(null, result.rows);
	});
}

module.exports.getRestIdById = function(id, cb){
	var values = [id];
	var q = 'SELECT "restId" FROM "Offers" WHERE id = $1';
	query(q, values, function(err, result){
		if(err){
			return cb(err);
		} else {
			return cb(null, result.rows[0]);
		}
	});
}

module.exports.getOffersById = function(id, cb){
	var values = [id];
	var q = 'SELECT * FROM "Offers" WHERE id = $1';

	query(q, values, function(err, result){
		if(err) return cb(err);
		return cb(null, result.rows[0]);
	}); 
}

module.exports.editOffer = function(offer, cb){
	var values = [offer.offerId, offer.offerName, offer.type, offer.price, offer.description, offer.startDate, offer.endDate, offer.offerImageName];

	var q = 'UPDATE "Offers" SET name = $2, type = $3, price = $4, description = $5, "startDate" = $6, "endDate" = $7, photo = $8 WHERE id = $1';

	query(q, values, function(err, result){
		if(err) return cb(err);
		return cb(null, result);
	}); 
}

module.exports.deleteOfferById = function(id, cb){
	var values = [id];
	var q = 'DELETE FROM "Offers" WHERE id = $1';
	query(q, values, function(err, result){
		if(err) return cb(err);
		return cb(null, result);
	}); 
}

module.exports.editRestaurantById = function(id, restaurant, cb){
 	var values = [id, restaurant.restaurantName, restaurant.phonenumber, restaurant.website, restaurant.description];
 	var q = 'UPDATE "Restaurant" SET "restaurantName" = $2, phonenumber = $3, website = $4, description = $5 WHERE id = $1';
 	query(q, values, function(err, result){
 		if(err) return cb(err);
 		return cb(null, result);
 	}); 
 }

 module.exports.editBranchesById = function(id, branches, cb){
 	console.log("ID: " + id);
 	var values = [id, branches.address, branches.city, branches.postal];
 	var q = 'UPDATE "Branches" SET address = $2, city = $3, postal = $4 WHERE "restId" = $1';
 	query(q, values, function(err, result){
 		if(err) return cb(err);
 		return cb(null, result);
 	}); 
 }


module.exports.editRestaurantImageById = function(id, restaurantImg, cb){
 	var values = [id, restaurantImg];
 	var q = 'UPDATE "Restaurant" SET image = $2 WHERE id = $1';
	query(q, values, function(err, result){
 		if(err) return cb(err);
 		return cb(null, result);
 	}); 
 }
 