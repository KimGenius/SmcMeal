var express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const date = require('date-and-time');
const schedule = require("node-schedule");
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const page = require('../ignore/token.json')
const FB = require('fb');
var router = express.Router();

/* GET Bab info. */
router.get('/', function (req, res, next) {
  FB.setAccessToken(page.accessToken)
  const url = "http://stu.sen.go.kr/sts_sci_md00_001.do?schulCode=B100000439&schulCrseScCode=4&schulKndScCode=04&schMmealScCode=1";
  const now = new Date();
  const day = date.format(now, 'DD');
  request(url, function (error, response, body) {
    if (error) throw error;
    var $ = cheerio.load(body);
    var elements = $("tbody td div");
    elements.each(function () {
      var isToday = $(this).html().substr(0, 2);
      if (isToday === day) {
        var result = date.format(now, 'YYYY-MM-DD-dddd') + "\n"
        var htmlData = $(this).html().split('<br>')
        htmlData.forEach(function (data) {
          if (data !== day) {
            const encodeData = entities.decode(data).replace(/[0-9]|\./gi, '')
            if (encodeData === "[중식]" || encodeData === "[석식]") {
              result += "\n" + encodeData + "\n"
            } else
              result += encodeData + "\n"
          }
        })
        FB.api(
          '/' + page.id + '/feed',
          'POST',
          {"message": result+'r'},
          function (res) {
            if (!res || res.error) {
              console.log("feed err : ", !res ? 'error occurred' : res.error);
              return;
            }
            console.log("facebook board : ", res)
            console.log('Post Id: ' + res.id);
          }
        );
      }
    });
  });
});


router.get('/auto', function (req, res, next) {

});

module.exports = router;
