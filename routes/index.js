var express = require('express');
var router = express.Router();
const page = require('../ignore/token')
const schedule = require('node-schedule')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', page: page, schedule: schedule });
});

module.exports = router;
