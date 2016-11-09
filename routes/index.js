var express = require('express');
var router = express.Router();
var SearchSession = require('../lib/SearchSession');

// GET index
// Render with title
router.get('/', function(req, res, next) {

	console.log(req.session);
  res.render('index', { title: 'Dino',  });
});

// GET profile
// Render profile page
router.get('/profile', function(req, res, next){
	res.render('profile');
});

router.post('/search', function(req, res, next){
	var parameterGroup = req.body.parameterGroup;
	var priceRange = req.body.priceRange.value;

	SearchSession.updateSession("", parameterGroup, priceRange, req)

	console.log(req.session);
	res.render('index', {title: 'Dino'});
});

module.exports = router;
