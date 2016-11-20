var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/img/restaurantImg' });
var upload2 = multer({dest: './public/img/offerImg'});
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
                res.redirect('admin');
            });
        } else {
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
    /// VANTAR ERROR HANDLING!!!
    if (err)
        throw (err);
    else {
        var branch;
        req.session.userInfo = user;
        req.session.userInfo.Email = userEmail;
        DBController.getRestaurantBranchesByRestId(user.id, function(err, branches){
            if(err)
                throw (err);
            else {
                console.log(branches)
                branch = branches;
            }
        });
        DBController.getOffersByRestId(user.id,function(err ,offers){
            if (err)
                throw (err);
            else {
                console.log(user);
                res.render('adminPage', {Email: userEmail, restaurantName: user.restaurantName, image: user.image, description: user.description, phonenumber: user.phonenumber, website: user.website, offers: offers, branches: branch});
                console.log(offers);
                }
            });
        }
    });
});
//Button to edit page
//==================================
//==================================
//==================================
// This should be a GET not a POST!!!
router.post('/admin/editRestaurantInfo',function(req, res, next){
    var userLogged=req.session.user;
    var user=req.session.userInfo;
    res.render('editRestaurantInfo',{user:userLogged, Email: user.Email, restaurantName: user.restaurantName, image: user.image, description: user.description, phonenumber: user.phonenumber, website: user.website});
});

//save edit (not finished)
//==================================
//==================================
//==================================
// This should be a PUT not a POST!!!
router.post('/admin/saveChanges',function(req, res, next){
    res.redirect('/users/admin');
})

//Button to add offer page
router.get('/addOffer', ensureLoggedIn, function(req, res, next){
    var user = req.session.user;
    res.render('admin',{user: user});
})
//-------------------------------------------

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
router.post('/addOffer', upload2.single('offerImage'), function(req, res, next){
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
            offerImageName: offerImageName,
            restName: req.session.user.restaurantName
        }
    };

        // Create a new user in the database
        DBController.createOffer(newOffer, function(err, offer){
            if(err) throw err;
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


// Get's offer info that user wants to edit 
// and renders it into a form.
// Needs to check if this user has the permission to 
// edit this offer. 
router.get('/editOffer:id', ensureLoggedIn, hasPermission, getValues, function(req, res, next){
    var offerValues = req.offerValues;
    req.session.offerValues = offerValues;
    offerValues.startDate = formatDate(offerValues.startDate);
    offerValues.endDate = formatDate(offerValues.endDate);
    res.render('editOffers', {offerValues: offerValues});
});

// Formats date to YYYY-MM-DD
function formatDate(d)
 {
  date = new Date(d)
  var dd = date.getDate(); 
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear(); 
  if(dd<10){dd='0'+dd} 
  if(mm<10){mm='0'+mm};
  return d = yyyy + '-' +mm+'-'+dd;
}

// Middleware to check if user has permission to edit this offer
function hasPermission(req, res, next){
    // var offerId = req.params.id;
    var offerId = req.params.id;
    var userId = req.session.user.id;

    // Get by offerId restId from DB 
    DBController.getRestIdById(offerId, function(err, result){
        if(err) throw err;
        if(result && result.restId === userId){
            next();
        }else{
            res.redirect('/users/admin');
        }
    });
}

// Middleware to get offer values from database.
function getValues(req, res, next){
    DBController.getOffersById(req.params.id, function(err, result){
        if(err){
            throw err;
            // Error page??
            res.redirect('/users/admin');
        }
        req.offerValues = result;
        next();
    });
}


router.post('/editOffer:id', upload2.single('offerImage'), editOffer, function(req, res, next){
    res.redirect('/users/admin');
});

// Middleware to edit offer in DB
function editOffer(req, res, next){
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
        var offerImageName = req.body.originalOfferImage;
    }

    // Validation
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
        // We need to render the view with errors and the values that
        // have been updated - Not a pretty solution...
        // We use the session to do this...
        req.session.offerValues.name = offerName;
        req.session.offerValues.type = type;
        req.session.offerValues.description.description = description;
        req.session.offerValues.startDate = startDate;
        req.session.offerValues.endDate = endDate;
        req.session.offerValues.photo = offerImageName;
        // If errors exist then render view and display error msg
        res.render('editOffers', {
            errors: errors, offerValues: req.session.offerValues
        });
    } else {
        // Else create newOffer object from form values
        // include restaurantId
        var offer = {
            offerId: req.params.id,
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

    DBController.editOffer(offer, function(err, result){
        if(err) throw err;
        next();
    });
    };
}

module.exports = router;
