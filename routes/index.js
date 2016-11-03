var express = require('express');
var router = express.Router();

// GET index
// Render with title
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dino',  });
});

// GET profile
// Render profile page
router.get('/profile', function(req, res, next){
	res.render('profile');
});

module.exports = router;
