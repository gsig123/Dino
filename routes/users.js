var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/img/restaurantImg' });
var DBController = require('../lib/DBController');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var users = require('../lib/users');


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.get('/login', redirectIfLoggedIn, function(req, res, next){
   res.render('login');

});

function redirectIfLoggedIn(req, res, next){
    if (req.session.user){
        res.redirect('/');
    } else {
        next();
    }
}

router.post('/login', function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;
    users.auth(email, password, function(err, user){
        if(user){
            req.session.regenerate(function (){
                req.session.user = user;
                console.log(user);
                res.redirect('admin');
            });
        } else {
            console.log("Passwords dont match");
            res.render('login');
        }
    })
});



router.get('/signup', function(req, res, next){
	res.render('signup');
});

router.post('/signup', upload.single('restaurantImage'), function(req, res, next){

	// Get values from form
	var restaurantName = req.body.restaurantName;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	var phonenumber = req.body.phonenumber;
	var website = req.body.website;
	var address = req.body.address;
	var city = req.body.city;
	var postalCode = req.body.postalCode;
	var description = req.body.description;

    console.log(restaurantName);

	// Check image upload
	if(req.file){
		var restaurantImageName = req.file.filename;
	} else {
		var restaurantImageName = 'noImage.jpg';
	}

	// Validation
	req.checkBody('restaurantName', 'Restaurant name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('phonenumber', 'Phonenumber is required').notEmpty();
    req.checkBody('phonenumber', 'Phonenumber should be 7 digits').isLength(7);
    req.checkBody('website', 'Website URL is required').notEmpty();
    req.checkBody('website', 'Website URL is not valid').isURL();
    req.checkBody('city', 'City is required').notEmpty();
    req.checkBody('postalCode', 'Postal Code is required').notEmpty();
    req.checkBody('postalCode', 'Postal Code should be 3 digits').isLength(3);

    // Validation errors
    var errors = req.validationErrors();

    // Check for validation errors
    if(errors){
    	
    	// If errors exist then render view and display error msg
    	res.render('signup', {
    		errors: errors
    	});
    } else {

    	// Else create newUser object from form values
    	var newUser = {
    		restaurantName: restaurantName,
    		email: email, 
    		password: password, 
    		phonenumber: phonenumber, 
    		website: website, 
    		address: address, 
    		city: city, 
    		postalCode: postalCode, 
    		description: description,
    		image: restaurantImageName
    	};

    	// Create a new user in the database
    	DBController.createUser(newUser, function(err, user){
    		if(err) throw err;
    		console.log(user);
    	});

    	// Redirect to index
    	res.redirect('/');
    }
});

router.get('/admin', ensureLoggedIn, function(req, res, next){
    var user = req.session.user;
	res.render('admin', {user: user});
});

router.post('/addOffer', upload.single('offerImage'), function(req, res, next){
        // Get values from form
    var offerName = req.body.offerName;
    var price = req.body.price;
    var type = req.body.type;
    var description = req.body.description;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var days = {
        mondays: req.body.mondays === "on",
        tuesdays: req.body.tuesdays === "on",
        wednesdays: req.body.wednesdays === "on",
        thursdays: req.body.thursdays === "on",
        fridays: req.body.fridays === "on",
        saturdays: req.body.saturdays === "on",
        sundays: req.body.sundays === "on"
    }
    var timeFrom = req.body.timeFrom;
    var timeTo = req.body.timeTo;

    // Check image upload 
    if(req.file){
        var offerImageName = req.file.filename;
    }else{
        var offerImageName = 'noOfferImage.jpg';
    }

    // // Validation
    req.checkBody('offerName', 'Offer name is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('type', 'Type is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('startDate', 'Start date is required').notEmpty();
    req.checkBody('endDate', 'End date is required').notEmpty();
    req.checkBody('timeFrom', 'Available from is required').notEmpty();
    req.checkBody('timeTo', 'Available to is required').notEmpty();

    // Validation errors
    var errors = req.validationErrors();

    // Check for validation errors
    if(errors){
        // If errors exist then render view and display error msg
        res.render('admin', {
            errors: errors
        });
    } else {
        // Else create newOffer object from form values
        // include restaurantId
        var newOffer = {
            restId: req.session.user.id,
            offerName: offerName, 
            price: price, 
            type: type,
            description: description, 
            startDate: startDate, 
            endDate: endDate, 
            days: days, 
            timeFrom: timeFrom,
            timeTo: timeTo,
            offerImageName: offerImageName
        }
    };

    res.redirect('/users/admin');

        // Create a new user in the database
        DBController.createOffer(newOffer, function(err, offer){
            if(err) throw err;
            console.log(offer);
        });

    // Redirect to admin page 
    res.redirect('/users/admin');
});

function ensureLoggedIn(req, res, next){
    if(req.session.user){
        next();
    } else {
        res.redirect('/users/login');
    }
};

router.get('/logout', function(req, res, next){
    req.session.destroy(function(){
        res.redirect('/');
    });
});







module.exports = router;