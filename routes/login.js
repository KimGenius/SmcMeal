var express = require('express');
const page = require('../ignore/token')
var router = express.Router();
router.post('/', function (req, res) {
  console.log(req.body)
  try {
    return res.status(200).json({
      status: 'success'
    })
  } catch (e) {
    return res.status(500).json({
      status: e.message
    })
  }
})

module.exports = router;
