var express = require('express');
var router = express.Router();
var SearchParams = require('../lib/SearchParams');
var SearchController = require('../lib/SearchController');

// GET index
// Render with title
router.get('/', function(req, res, next) {

    // If no params in session => initialize
    if (!req.session.params) {
        SearchParams.init(req, function(params) {

            // Get params from session
            var types = params.types;
            var priceRange = params.priceRange;
            var searchBar = params.searchBar;

            // Get offers from database
            SearchController.getOfferList(types, priceRange, searchBar, function(err, offerlist){
                if(err) throw err;
                console.log(offerlist);
                // render with params
                res.render('index', { title: 'Dino', types: types, priceRange: priceRange, searchBar: searchBar, offerlist: offerlist });
            });
        });
    } else {
        // Else render with params from session
        var params = req.session.params;
        var types = params.types;
        var priceRange = params.priceRange;
        var searchBar = params.searchBar;

        // Get offers from database
        SearchController.getOfferList(types, priceRange, searchBar, function(err, offerlist){
            if(err) throw err;
            console.log("HERE : " + offerlist);
            // render with params
            res.render('index', { title: 'Dino', types: types, priceRange: priceRange, searchBar: searchBar, offerlist: offerlist });
        });
    }

});

// GET profile
// Render profile page
router.get('/profile', function(req, res, next) {
    res.render('profile');
});

router.post('/search', function(req, res, next) {
    res.redirect('/');
});


router.get('/testStuff', function(req, res, next) {
    // SearchController.makeOfferList(function(err, offers) {
    //     if (err) console.log(err);
    //     console.log(offers);
    //     res.render('index', { offers: offers });
    // });
});

// A post request => Called from frontend to add type to session
router.post('/addType:name', function(req, res, next) {
    // Get type to add from url
    var type = req.params;

    // Add type active to session
    SearchParams.addType(type, req, function() {
        res.sendStatus(200);
    });
});

// A post request => Called from frontend to remove type from session
router.post('/removeType:name', function(req, res, next) {
    // Get type to add from url
    var type = req.params;

    // Add type active to session
    SearchParams.removeType(type, req, function() {
        res.sendStatus(200);
    });
});

// A post request => Called from frontend to update priceRange
router.post('/updatePriceRange:values', function(req, res, next){

    // Get values from url as string
    var string = req.params.values;

    // Turn it into an array
    var values = JSON.parse("[" + string + "]");

    // Send to session 
    SearchParams.updatePriceRange(values[0], values[1], req, function(){
        res.sendStatus(200);
    });
});

// A post request => Called from frontend to update searchBar
router.post('/updateSearchBar:searchString', function(req, res, next){

    // Get values from url as string
    var searchBar = req.params.searchString;

    // Send to session
    SearchParams.updateSearchBar(searchBar, req, function(){
        res.sendStatus(200);
    });
});



module.exports = router;
