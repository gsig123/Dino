var DBController = require('./DBController');

module.exports.makeOfferList = function(cb){


	DBController.getAllOffers(function(err, results){
		if(err) throw err;
		cb(null, results.rows);
	});

}




