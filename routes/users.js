var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/img/restaurantImg' });
var DBController = require('../lib/DBController');


// GET Login view. calls middleware "redirectIfLoggedIn" to check if
// user is already logged in and then redirects.
router.get('/login', redirectIfLoggedIn, function(req, res, next){
   res.render('login');

});

// Middleware to check if user is logged in
// If user is logged in -> Redirect to index
function redirectIfLoggedIn(req, res, next){
    if (req.session.user){
        res.redirect('/');
    } else {
        next();
    }
}

// POST on login view.
// Tries to log user in
// if it doesn't work -> Render to login page.
router.post('/login', function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;
    DBController.auth(email, password, function(err, user){
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


// GET signup view
router.get('/signup', function(req, res, next){
	res.render('signup');
});

// POST on signup view.
// Tries to signup a new user.
// If errors -> Render signup page with errors.
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

// GET admin view (restaurant informations)
// Calls middleware "ensureLoggedIn" to make sure user is logged in.
// Renders view with user object.
router.get('/admin', ensureLoggedIn, function(req, res, next){
  var userEmail = req.session.user.email;
  DBController.findAllUserInfo(userEmail, function(err, user){
      req.session.regenerate(function (){
          req.session.userInfo = user;
          req.session.userInfo.Email = userEmail;
          console.log(user);
          res.render('adminPage', {Email: userEmail, restaurantName: user.restaurantName, image: user.image, description: user.description, phonenumber: user.phonenumber, website: user.website})
      });
  });
  var userInfo= req.session.userInfo;
  console.log(userInfo);
});
//editi Button for restaurant information
router.post('/admin',function(req, res, next){
    res.redirect('/editRestaurantInfo');
});
//-------------------------------------------Jiahao
router.get('editRestaurantInfo', function(req, res, next){
    var user = req.session.userInfo;
    res.render('editRestaurantInfo', {Email: user.Email, restaurantName: user.restaurantName, image: user.image, description: user.description, phonenumber: user.phonenumber, website: user.website})
});
//-------------------------------------------Jiahao

// Middleware to make sure user is logged in.
// If he is not logged in -> Redirect to login page.
function ensureLoggedIn(req, res, next){
    if(req.session.user){
        next();
    } else {
        res.redirect('/users/login');
    }
};

// POST on admin page to add a new offer.
// Redirects to admin page
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
    console.log(timeFrom);
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

        // Create a new user in the database
        DBController.createOffer(newOffer, function(err, offer){
            if(err) throw err;
            console.log(offer);
        });

    // Redirect to admin page
    res.redirect('/users/admin');
});

// GET to logout
// Destroys user session
router.get('/logout', function(req, res, next){
    req.session.destroy(function(){
        res.redirect('/');
    });
});

module.exports = router;
