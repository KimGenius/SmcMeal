var express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const date = require('date-and-time');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const url = "http://stu.sen.go.kr/sts_sci_md00_001.do?schulCode=B100000439&schulCrseScCode=4&schulKndScCode=04&schMmealScCode=1";
  const now = new Date();
  const day = date.format(now, 'DD');
  request(url, function (error, response, body) {
    if (error) throw error;
    var $ = cheerio.load(body);
    var postElements = $("tbody td div");

    postElements.each(function () {
      var postTitle = $(this).text();
      if (postTitle.substr(0, 2) === day) {
        var morning = postTitle.split('[중식]')[0];
        morning = morning.substr(2, morning.length);
        const lunch = "[중식]" + postTitle.split('[석식]')[0].split('[중식]')[1];
        const dinner = "[석식]" + postTitle.split('[석식]')[1];
        console.log(morning + "\n");
        console.log(lunch + "\n");
        console.log(dinner);
        var result = morning + "\n" + lunch + "\n" + dinner;
        return res.status(200).json({
          message: result
        });
      }
    });
  });
});

module.exports = router;
