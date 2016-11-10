// Init params in session
module.exports.init = function(req, cb){

	var params = {
		searchBar: "",
		types : [{ 
				name: "Fast Food",
				active: ""
				},
				{ 
				name: "Fine Dining",
				active: ""
				},
				{ 
				name: "Bistro",
				active: ""
				},
				{ 
				name: "Vegan",
				active: ""
				},
				{ 
				name: "Vegeterian",
				active: ""
				},
				{ 
				name: "Seafood",
				active: ""
				},
				{ 
				name: "Italian",
				active: ""
				},
				{ 
				name: "Mexican",
				active: ""
				},
				{ 
				name: "Asian",
				active: ""
				},
				{ 
				name: "Kebab",
				active: ""
				}

		],
		priceRange: {
			low: 500,
			high: 10000
		}
	};

	req.session.params = params;

	cb(params);
}

// Add active status to a type in session
module.exports.addType = function(type, req, cb){
	// Get types from session
	var types = req.session.params.types;

	// Find right object in array and change it's active attribute.
	for(var i = 0; i < types.length; i++){
		if(types[i].name === type.name){
			types[i].active = "active";
		}
	}

	console.log(types);
	cb();
}


// Remove active status from a type in session
module.exports.removeType = function(type, req, cb){
	// Get types from session
	var types = req.session.params.types; 

	// Find right object in array and change it's active attribute.
		for(var i = 0; i < types.length; i++){
		if(types[i].name === type.name){
			types[i].active = "";
		}
	}

	console.log(types);
	cb();
}

// Update priceRange low and high status in session
module.exports.updatePriceRange = function(low, high, req, cb){
	// Set new values of low and high
	req.session.params.priceRange.low = low;
	req.session.params.priceRange.high = high;

	console.log(req.session.params);
	cb();
}
