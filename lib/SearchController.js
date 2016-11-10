var DBController = require('./DBController');

module.exports.getOfferList = function(types, priceRange, searchBar, cb) {
    var offerList = [];
    var values = [];
    var q = '';

    // Populate values array
    for (var i = 0; i < types.length; i++) {
        if (types[i].active === "active") {
            values.push(types[i].name);
        }
    }

    // Make a string of $1...$n to put in query for types.
    var typeString = "";
    if (values.length > 0) {
        for (var i = 0; i < values.length - 1; i++) {
            var k = i + 1;
            typeString = typeString + "$" + k + ", ";
        }

        var k = values.length;
        typeString = typeString + "$" + k;
        typeString = "(" + typeString + ")";

        q = 'SELECT * FROM "Offers" WHERE type IN ' + typeString + ';';

        DBController.getOffers(q, values, function(err, results) {
            if (err) throw err;
            offerList = results.rows;
            console.log(offerList);
        });
    }

    console.log("JHH: " + offerList);
    cb(null, offerList);
}






// SELECT * FROM "Offer" WHERE type IN ($1, $2, $3, ...) OR WHERE price BETWEEN [high] and [low] OR WHERE name LIKE '%[searchBar]%';
