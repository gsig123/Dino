var pg = require('pg');
pg.defaults.ssl = true;


// Database URL
var DATABASE = 'postgres://ojofftkgraowbe:58x4ZrQADy4bkQ_dOaGE_PQw0k@ec2-54-75-232-54.eu-west-1.compute.amazonaws.com:5432/df70gei51qcp3s';

/* 
* Query Function
*
* Takes in variable q (the query) and values to execute in the query aswell as a callback function.
* Runs the query and if it's successful it returns result in the callback function. 
*
* Example of usage:
*
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
