var express = require('express');
var router = express.Router();
var SearchParams = require('../lib/SearchParams');

// GET index
// Render with title
router.get('/', function(req, res, next) {

    // If no params in session => initialize
    if (!req.session.parameters) {
        SearchParams.init(req, function(err) {
            // if error console log it
            if (err) return console.log(err);

            // Get params from session
            var checkedTypes = req.session.parameters.checkedTypes;
            var priceRange = req.session.parameters.priceRange;
            var searchBar = req.session.searchBar;

            // render with params
            res.render('index', {
                title: 'Dino',
                checkedTypes: checkedTypes,
                priceRange: priceRange,
                searchBar: searchBar
            });
        });

    } else {
        // Get params from session
        var checkedTypes = req.session.parameters.checkedTypes;
        var priceRange = req.session.parameters.priceRange;
        var searchBar = req.session.searchBar;

        // render with params
        res.render('index', {
            title: 'Dino',
            checkedTypes: checkedTypes,
            priceRange: priceRange,
            searchBar: searchBar
        });
    }
});

// GET profile
// Render profile page
router.get('/profile', function(req, res, next) {
    res.render('profile');
});

router.post('/search', function(req, res, next) {

    // Get values from view
    var types = req.body.types;
    var priceRange = req.body.priceRange;
    var searchBar = req.body.searchBar;

    // SetUp on object that holds checked boxes
    var checkedTypes = {};

    // Hack if types is empty - Else we get 'split is not a function'
    types = types + '';

    // String to array
    types = types.split(',');
    for (i = 0; i < types.length; i++) {
        var item = types[i];
        checkedTypes[item] = "checked";
    }

    // Change pricerange from string to array of ints
    priceRange = priceRange.split(',').map(function(item) {
        return parseInt(item);
    });

    // Add to session the parameters 
    SearchParams.updateParams(searchBar, checkedTypes, priceRange, req, function(err){
    	if(err) console.log(err);
    	res.redirect('/');
    });
});

module.exports = router;
