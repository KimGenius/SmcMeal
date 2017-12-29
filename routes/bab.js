var express = require('express');
const page = require('../ignore/token')
var router = express.Router();
const FB = require('fb')
router.post('/token', function (req, res) {
  try{
    FB.api('/oauth/access_token',
    {
      grant_type:'fb_exchange_token',      
      client_id:page.getClientId(),
      client_secret:page.getClientSecret(),
      fb_exchange_token:req.body.token
    },
    function(response){
      console.log('login success!')
      page.setToken(response.access_token)
      return res.status(200).json({
        status: 'success',
        longAccessToken: response.access_token
      })
    })
  } catch (e) {
    return res.status(500).json({
      status: e.message
    })
  }
})

module.exports = router;
