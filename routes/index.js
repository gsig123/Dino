var express = require('express');
var router = express.Router();




router.get('/', function(req, res, next) {

  res.render('index', { title: 'Dino',  });
});



router.get('/profile', function(req, res, next){
	res.render('profile');
});

router.get('/addType', function(req, res, next){



	res.redirect('/');
});

module.exports = router;
