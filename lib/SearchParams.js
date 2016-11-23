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
			low: 0,
			high: 10000
		},
		// Checked is set to "checked"
		sortBy: [{
			name: "Price", 
			checked: ""
		},
		{
			name: "Name",
			checked: "checked"
		},
		{
			name: "Restaurant",
			checked: ""
		},
		{
			name: "Types",
			checked: ""
		}],

		ordering: [{
			name: "Ascending",
			checked: "checked"
		},
		{
			name: "Descending",
			checked: ""
		}]
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
	cb();
}

// Update priceRange low and high status in session
module.exports.updatePriceRange = function(low, high, req, cb){
	// Set new values of low and high
	req.session.params.priceRange.low = low;
	req.session.params.priceRange.high = high;
	cb();
}

// Update searchBar in session
module.exports.updateSearchBar = function(searchBar, req, cb){
	// Update searchBar in session
	req.session.params.searchBar = searchBar;
	cb();
}

// Update sortBy in session
module.exports.updateSortBy = function(name, req, cb){
	var sortBy = req.session.params.sortBy;


	for(i=0;i<sortBy.length;i++){
		// Start by cleaning out checked items. 
		sortBy[i].checked = "";
		// Then add checked to the right item
		if(sortBy[i].name === name) sortBy[i].checked = "checked";
	}
	console.log(sortBy);
	req.session.params.sortBy = sortBy;
	cb();
}

module.exports.updateOrdering = function(name, req, cb){
	var	ordering = req.session.params.ordering
	for(i=0;i<ordering.length;i++){
		ordering[i].checked = "";

		if(ordering[i].name === name) ordering[i].checked = "checked";
	}
	req.session.params.ordering = ordering;
	cb();
}