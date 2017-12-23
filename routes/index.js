var express = require('express');
var router = express.Router();
const page = require('../ignore/token')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', page: page });
});

module.exports = router;
