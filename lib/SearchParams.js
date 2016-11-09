module.exports.init = function(req, cb){

	var parameters = {
		searchBar: "",
		checkedTypes: {},
		priceRange: [500, 10000]
	};

	req.session.parameters = parameters;

	cb();
}

module.exports.updateParams = function(searchBar, checkedTypes, priceRange, req, cb){
	var parameters = {
		searchBar: searchBar,
		checkedTypes: checkedTypes,
		priceRange: priceRange
	};

	req.session.parameters = parameters;

	cb();
}

