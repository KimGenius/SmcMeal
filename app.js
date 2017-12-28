/* global $ */
var express = require('express')
var path = require('path')
// var favicon = require('serve-favicon')
// var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var moment = require('moment-timezone')

var index = require('./routes/index')
var users = require('./routes/users')
var bab = require('./routes/bab')
var login = require('./routes/login')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/jquery', express.static(`${__dirname}/node_modules/jquery/dist/`))
app.use('/node-schedule', express.static(`${__dirname}/node_modules/node-schedule`))
app.use('/fb', express.static(`${__dirname}/node_modules/fb/lib/`))

app.use('/', index)
app.use('/users', users)
app.use('/bab', bab)
app.use('/login', login)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const request = require('request')
const cheerio = require('cheerio')
const date = require('date-and-time')
const schedule = require('node-schedule')
const Entities = require('html-entities').XmlEntities
const entities = new Entities()
const page = require('./ignore/token')
const FB = require('fb')
const info = require('./ignore/info')

module.exports = app.listen(8160, function () {
  //TODO : 서버 시간이 달라서 cron 수정 필요
  schedule.scheduleJob('1 1 1 * * *', function () {
    console.log(page.getToken())
    FB.setAccessToken(page.getToken())
    request(info.getUrl(), function1)
  })
  console.log('Bab is hot!')
})

function function1(err, response, body) {
  if (err) throw err
  global.$ = cheerio.load(body)
  var elements = $('tbody td div')
  elements.each(function2)
}

function function2() {
  const date = moment().tz('Asia/Seoul').format('YYYY-MM-DD-dddd')
  const day = moment().tz('Asia/Seoul').format('DD')
  const isToday = $(this).html().substr(0, 2)
  if (isToday === day) {
    var result = date + '\n'
    var htmlData = $(this).html().split('<br>')
    for (let data of htmlData) {
      if (data !== day) {
        const encodeData = entities.decode(data).replace(/[0-9]|\./gi, '')
        if (encodeData === '[중식]' || encodeData === '[석식]') {
          result += '\n' + encodeData + '\n'
        } else { result += encodeData + '\n' }
      }
    }
    if (result !== date.format(now, 'YYYY-MM-DD-dddd') + '\n') {
      FB.api(
        '/' + page.getPageId() + '/feed',
        'POST',
        { 'message': result + '\n\nCreated by GeniusK & Leesane' },
        function (res) {
          if (!res || res.error) {
            console.log('feed err : ', !res ? 'error occurred' : res.error)
            return
          }
          console.log('time : ', now)
          console.log('facebook board : ', res)
          console.log('Post Id: ' + res.id)
        }
      )
    } else {
      console.log('주말 잘 보내세용')
    }
  }
}
