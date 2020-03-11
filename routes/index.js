var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  if(req.session.weight != undefined){
    res.redirect('/result');
  }
  res.render("index");
});

let weight = 0;
let alcohol_g = 0;
let sum_alcohol_g = 0;
let current_stable = "シラフ";
let blood_alcohol_concentration = 0;

router.get("/result", function(req, res, next) {
  data = {
    sum_alcohol_g: sum_alcohol_g,
    blood_alcohol_concentration: blood_alcohol_concentration,
    stable: current_stable
  };
  res.render("result", data);
});

router.post("/result", function(req, res, next) {
  if (req.session.weight == undefined) {
    weight = req.body["weight"];
  }
  req.session.weight = weight;
  if (req.body["percent"] != undefined && req.body["quantity"]) {
    var percent = Number(req.body["percent"]);
    var drink_quantity = req.body["quantity"];
    //純アルコール量を計算
    alcohol_g = ((drink_quantity * percent) / 100) * 0.8;
    //合計アルコール量(g)を計算
    if (req.session.sum_alcohol_g != undefined) {
      sum_alcohol_g = req.session.sum_alcohol_g + alcohol_g;
    } else {
      sum_alcohol_g = alcohol_g;
    }
    req.session.sum_alcohol_g = sum_alcohol_g;
    //最高血中アルコール濃度を計算
    blood_alcohol_concentration =
      (sum_alcohol_g / (req.session.weight * 1000 * 0.66)) * 100;
    //小数第２位で四捨五入
    blood_alcohol_concentration = Math.round(blood_alcohol_concentration * 100) / 100;
    sum_alcohol_g = Math.round(sum_alcohol_g * 100) / 100;
    current_stable = stable(blood_alcohol_concentration);
  }
  var data = {
    sum_alcohol_g: sum_alcohol_g,
    blood_alcohol_concentration: blood_alcohol_concentration,
    stable: current_stable
  };
  res.render("result", data);
});

function stable(blood_alcohol_concentration) {
  if (blood_alcohol_concentration < 0.02) {
    return "シラフ";
  } else if (
    0.02 <= blood_alcohol_concentration &&
    blood_alcohol_concentration <= 0.04
  ) {
    return "爽快期";
  } else if (
    0.04 < blood_alcohol_concentration &&
    blood_alcohol_concentration <= 0.1
  ) {
    return "ほろ酔い期";
  } else if (
    0.1 < blood_alcohol_concentration &&
    blood_alcohol_concentration <= 0.15
  ) {
    return "酩酊初期";
  } else if (
    0.15 < blood_alcohol_concentration &&
    blood_alcohol_concentration <= 0.3
  ) {
    return "酩酊極期";
  } else if (
    0.3 < blood_alcohol_concentration &&
    blood_alcohol_concentration <= 0.4
  ) {
    return "泥酔期";
  } else {
    return "昏睡期";
  }
}

module.exports = router;
