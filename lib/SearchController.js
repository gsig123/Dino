var DBController = require('./DBController');
var when = require('when');

module.exports.getOfferList = function(params, cb) {
    if(!params) return;

    // Get types, priceRange and searchBar from params object.
    var types = params.types; 
    var priceRange = params.priceRange;
    var searchBar = params.searchBar;
    var sortBy = params.sortBy;
    var ordering = params.ordering

    // Create all queries and search by them.
    // Using when promises package.
    var searchQuery = createSearchQuery(types, priceRange, searchBar, sortBy, ordering);
    DBController.getOffers(searchQuery, function(err,results){
        if (err){
            throw err;
        }
        cb(null, results.rows);
    });
}

// Computes the intersection of 2 arrays a and b

// assumes a and b contain structurally identical objects
// with an 'id' attribute
var intersection = function(a, b){
    return a.filter(function(val){
        for (i in b){
            if (b[i].id===val.id) return true;
        };
        return false;
    });
}

var createSearchQuery = function(types, priceRange, searchBar, sortBy, ordering) {
    var searchQuery = {queryString: "", values: []};
    var values = []
    var c = 0;
    var q = 'SELECT * FROM "Offers"';

    // Types handling
    for (var i = 0; i < types.length; i++) {
        if (types[i].active === "active") {
            values.push(types[i].name);
        }
    }
    if (values.length > 0) {

        // Make a string of $1...$n to put in queryString for n types
        var typeString = "";
        for (var i = 0; i < values.length - 1; i++) {
            c++;
            var k = c;
            typeString = typeString + "$" + k + ", ";
        }
        c++;
        typeString = typeString + "$" + c;
        typeString = "(" + typeString + ")";
        q += ' WHERE type IN ' + typeString;
    }

    // Price range handling
    if(values.length>0) {
        q += ' AND ';
    } else {
        q += ' WHERE ';
    } 
    q += 'price BETWEEN $' + (c+1) + ' AND $' + (c+2);
    c += 2;
    values.push(priceRange.low);
    values.push(priceRange.high);

    // Search Bar handling
    if (searchBar !== '') {
        values.push('%'+searchBar+'%');
        // Query string
        q += ' AND name iLIKE $'+(c+1);
        c++;
    } // if the search bar is empty, don't do shit
    sortBy = sortBy.filter(function(x){
        return x.checked === "checked";
    })[0].name;
    ordering = ordering.filter(function(x){
        return x.checked === "checked";
    })[0].name;
    if (sortBy==="Name"){
        sortBy = "name";
    } else if (sortBy==="Restaurant"){
        sortBy='"restName"';
    } else if (sortBy==="Type"){
        sortBy = "type";
    } else {
        sortBy = "price";
    }
    q += ' ORDER BY ' + sortBy;
    if(ordering === 'Ascending'){
        q += ' ASC';
    } else {
        q += ' DESC';
    }
    searchQuery.queryString = q;
    searchQuery.values = values;
    return searchQuery;
}