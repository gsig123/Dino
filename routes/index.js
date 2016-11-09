var express = require('express');
var router = express.Router();
var SearchSession = require('../lib/SearchSession');

// GET index
// Render with title
router.get('/', function(req, res, next) {

  console.log(req.session);
  res.render('index', { title: 'Dino',  checked: {}, priceRange: "500, 10000", priceRangeArr: [500, 10000]});
});

// GET profile
// Render profile page
router.get('/profile', function(req, res, next){
	res.render('profile');
});

router.post('/search', function(req, res, next){

	// Get values 
	var parameterGroup = req.body.parameterGroup;
	var priceRange = req.body.priceRange;
	var searchBar = req.body.searchBar;

	// Change priceRange from string to array of ints
	priceRange = priceRange.split(',').map(function(item) {
    	return parseInt(item);
	});

	// Add to session the parameters 
	SearchSession.updateSession(searchBar, parameterGroup, priceRange, req);


	// SetUp on object that holds checked boxes
	var checked = {}

	// Hack if parameterGroup is empty - Else we get 'split is not a function'
	parameterGroup = parameterGroup + '';

	// String to array
	params = parameterGroup.split(',');
	for(i=0; i<params.length; i++){
		var item = params[i];
		checked[item] = "checked";
	}

	// Price range to string with array
	priceRangeArr = priceRange + '';
	priceRangeArr = priceRangeArr.split(',');

	res.render('index', {title: 'Dino', parameters: req.session.parameters, checked: checked, priceRange: priceRange, priceRangeArr: priceRangeArr});
});

module.exports = router;
