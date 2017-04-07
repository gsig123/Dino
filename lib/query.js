var pg = require('pg');
pg.defaults.ssl = true;


// Database URL
var DATABASE = process.env.DB_CONNECT;

/*
* Query Function
*
* @param {string} query - The query to run.
* @param {array} values - The values to run in query.
* @param {function} callback - The callback function.
* @return {function} Returns callback function with errors or result.
*
* @example:
* query("INSERT INTO sometable (column1, column2) VALUES ($1, $2)", [value1, value2], function(err)){..}
*/
module.exports = function query(q, values, callback) {


	pg.connect(DATABASE, function(error, client, done){

		if(error) {
			console.error('Error connecting to DB', error);
			return callback(error);
		}
		console.log('Database connected');


		client.query(q, values, function(err, result){
			done();

			if(err){
				console.error('Error running query', q, values, err);
				return callback(err);
			} else {
				return callback(null, result);
			}
		});
	});

};
