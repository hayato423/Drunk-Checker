var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});



let weight = 0;
let alcohol_g = 0
let sum_alcohol_g = 0
let sum_drink_quantity = 0;

router.get('/result',function(req,res,next) {
  weight = req.query.weight;
  req.session.weight = weight;
  data = {
    sum_alcohol_g : 0,
    blood_alcohol_concentration : 0
  }
  res.render('result',data);
});


router.post('/result',function(req,res,next) {
  var percent = Number(req.body['percent']);
  var drink_quantity = req.body['quantity'];
  //純アルコール量を計算
  alcohol_g = drink_quantity * percent / 100 * 0.8;
  //合計アルコール量(g)を計算
  if(req.session.sum_alcohol_g != undefined){
    sum_alcohol_g = req.session.sum_alcohol_g + alcohol_g;
  }else{
    sum_alcohol_g = alcohol_g;
  }
  req.session.sum_alcohol_g = sum_alcohol_g;
  //最高血中アルコール濃度を計算
  var blood_alcohol_concentration = sum_alcohol_g / (req.session.weight*1000*0.66) * 100
  //小数第２位で四捨五入
  blood_alcohol_concentration = Math.round(blood_alcohol_concentration * 100) / 100
  var data = {
    sum_alcohol_g : sum_alcohol_g,
    blood_alcohol_concentration : blood_alcohol_concentration
  };
  res.render('result',data);
});


module.exports = router;