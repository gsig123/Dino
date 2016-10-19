var pg = require('pg');
pg.defaults.ssl = true;

var DATABASE = 'postgres://ojofftkgraowbe:58x4ZrQADy4bkQ_dOaGE_PQw0k@ec2-54-75-232-54.eu-west-1.compute.amazonaws.com:5432/df70gei51qcp3s';

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
