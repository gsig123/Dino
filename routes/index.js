var express = require('express');
var router = express.Router();

var test = require('../lib/test');

/* GET home page. */
router.get('/', function(req, res, next) {

  test.addRestaurant('name', 'photos', 'email', 'password', 'description', 1234567, function(err, result){
  	if(result){
  		console.log('Successful!');
  	} else {
  		console.log('Error!');
  	}
  });
  
  res.render('index', { title: 'Dino' });
});

module.exports = router;
