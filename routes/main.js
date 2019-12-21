var express = require('express');
 
var router = express.Router();

router.get('/main', function(req, res, next) {
    res.render('main.ejs', { title: 'Express' });
  });

module.exports = router;


