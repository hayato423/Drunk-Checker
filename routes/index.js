var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});



let weight = 0;
let alcohol_g = 0
let sum_alcohol_g = 0
const coefficient = 0.8   //アルコール比重

router.get('/result',function(req,res,next) {
  weight = req.query.weight;
  req.session.weight = weight;
  data = {
    blood_alcohol_concentration : 0
  }
  res.render('result',data);
});


router.post('/result',function(req,res,next) {
  var percent = Number(req.body['percent']);
  var quantity = req.body['quantity'];
  alcohol_g = quantity * percent / 100 * coefficient;
  console.log(percent + " : " + quantity + " : " + alcohol_g);
  if(req.session.sum_alcohol_g != undefined){
    sum_alcohol_g = req.session.sum_alcohol_g + alcohol_g;
  }else{
    sum_alcohol_g = alcohol_g;
  }
  req.session.sum_alcohol_g = sum_alcohol_g;
  var blood_alcohol_concentration = sum_alcohol_g / req.session.weight * 0.75;
  var data = {
    blood_alcohol_concentration : blood_alcohol_concentration
  };
  res.render('result',data);
});


module.exports = router;