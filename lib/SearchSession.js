module.exports.init = function(req){
	var parameters = {
		searchBar: "",
		parameters: [],
		pricerange: [0, 10000]
	};

	req.session.parametes = parameters;
}

module.exports.updateSession = function(searchBar, parameters, pricerange, req){
	var parameters = {
		searchBar: searchBar,
		parameters: parameters,
		pricerange: pricerange
	};

	req.session.parameters = parameters;
}

