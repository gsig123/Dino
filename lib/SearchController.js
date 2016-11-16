var DBController = require('./DBController');
var when = require('when');

module.exports.getOfferList = function(params, cb) {
    if(!params) return;

    // Get types, priceRange and searchBar from params object.
    var types = params.types; 
    var priceRange = params.priceRange;
    var searchBar = params.searchBar;

    // Create all queries and search by them.
    // Using when promises package.
    when.all([
        createTypeQuery(types), 
        createPriceRangeQuery(priceRange), 
        createSearchBarQuery(searchBar)
        // Only when all queries have been created, run the query
        ]).spread(function(typeQuery, priceRangeQuery, searchBarQuery){
            DBController.getOffers(typeQuery, priceRangeQuery, searchBarQuery, function(err, results){
                if(err) throw err;
                // results[0] from type search
                // results[1] from priceRange search
                // results[2] from searchBar search
                // ==== NEEDS SOME CLEAN UP AND COMBINATION ====
                // Tentatively returns all results from search bar.
                cb(null, results[2]);
            });
        });

}

// Creates a query to get offers by type. 
// 
// Takes in types object which holds all types 
// and says who are active at the moment. 
// 
// Returns an object with the queryString and values
// to query by. 
var createTypeQuery = function(types){
    // Object to hold the query and values.
    var typeQuery = {queryString: "", values: []};

    // Value array to hold the values to query by. 
    var values = [];

    // Loop through types to check which have been selected
    // and are therefore 'active'
    for (var i = 0; i < types.length; i++) {
        if (types[i].active === "active") {
            values.push(types[i].name);
        }
    }

    // If there are no values selected, return an empty object. 
    if (values.length <= 0) return typeQuery; 

    // Make a string of $1...$n to put in queryString for n types
    var typeString = "";
    for (var i = 0; i < values.length - 1; i++) {
        var k = i + 1;
        typeString = typeString + "$" + k + ", ";
    }
    var k = values.length;
    typeString = typeString + "$" + k;
    typeString = "(" + typeString + ")";

    // Query string for types selected. 
    var q = 'SELECT * FROM "Offers" WHERE type IN ' + typeString + ';';

    // Populate the object
    typeQuery.queryString = q; 
    typeQuery.values = values;

    // Return the object
    return typeQuery;
}

// Creates a query to get offers by priceRange. 
// 
// Takes in priceRange object which holds all high
// and low values.
// 
// Returns an object with the queryString and values
// to query by. 
var createPriceRangeQuery = function(priceRange){
    // Object to hold the queryString and values to search by. 
    var priceRangeQuery = {queryString: "", values: []};

    // Value array to hold the values to query by. 
    var values = [priceRange.low, priceRange.high];

    // Query String for priceRange
    var q = 'SELECT * FROM "Offers" WHERE price BETWEEN $1 AND $2';

    // Populate the object
    priceRangeQuery.queryString = q;
    priceRangeQuery.values = values;

    // Return the object
    return priceRangeQuery;
}

// Creates a query to get offers by searchBar. 
// 
// Takes in searchBar string
// 
// Returns an object with the queryString and values
// to query by. 
var createSearchBarQuery = function(searchBar){
    // Object to hold the queryString and values to search by. 
    var searchBarQuery = {queryString: "", values: []};
    if (searchBar === '') {
        // If the search bar is empty, return all values.
        var values = [];
        var q = 'SELECT * FROM "Offers"';
    } else {
        // Otherwise impose restriction on search results.
        // Value array to hold the values to query by. 
        var values = ['%'+searchBar+'%'];

        // Query string
        var q = 'SELECT * FROM "Offers" WHERE name iLIKE $1';
    }
    // Populate the object
    searchBarQuery.queryString = q;
    searchBarQuery.values = values; 

    // Return the object
    return searchBarQuery; 
}

