var express = require('express');
var router = express.Router();


let weight = 0;
/* GET home page. */
router.get('/', function(req, res, next) {
  weight = req.query.weight;
  res.render('index');
});




router.get('/result',function(req,res,next) {
  res.render('result');
})


router.post('/result',function(req,res,next) {
  res.render('result');
})


module.exports = router;