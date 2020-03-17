var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  if (req.session.weight != undefined) {
    res.redirect("/result");
  } else {
    res.render("index");
  }
});

let alcohol_g = 0;
let sum_alcohol_g = 0;
let current_status = "シラフ";
let blood_alcohol_concentration = 0;
let weight = 0;

router.get("/result", function(req, res, next) {
  //体重が未入力ならindexにリダイレクト
  if (req.session.weight == undefined) {
    res.redirect('/');
  } else {
    data = {
      sum_alcohol_g: req.session.sum_alcohol_g,
      blood_alcohol_concentration: req.session.blood_alcohol_concentration,
      status: req.session.current_status,
      msg: message(req.session.current_status)
    };
    res.render("result", data);
  }
});

router.post("/result", function(req, res, next) {
  //セッションに体重の情報がなかったら（初回アクセス時）
  if (req.session.weight == undefined) {
    req.session.weight = req.body["weight"];
    blood_alcohol_concentration = 0;
    sum_alcohol_g = 0;
    current_status = 'シラフ';
  }
  if (req.body["percent"] != undefined && req.body["quantity"] != undefined) {
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
    blood_alcohol_concentration =
      Math.round(blood_alcohol_concentration * 100) / 100;
    sum_alcohol_g = Math.round(sum_alcohol_g * 100) / 100;
    current_status = status(blood_alcohol_concentration);
  }
  //セッションに保存
  req.session.blood_alcohol_concentration = blood_alcohol_concentration;
  req.session.sum_alcohol_g = sum_alcohol_g;
  req.session.current_status = current_status;
  var data = {
    sum_alcohol_g: req.session.sum_alcohol_g,
    blood_alcohol_concentration: req.session.blood_alcohol_concentration,
    status: req.session.current_status,
    msg : message(req.session.current_status)
  };
  res.render("result", data);
});


function status(blood_alcohol_concentration) {
  if (blood_alcohol_concentration < 0.01) {
    return "シラフ";
  } else if ( 0.01 <= blood_alcohol_concentration && blood_alcohol_concentration <= 0.04) {
    return "爽快期";
  } else if ( 0.04 < blood_alcohol_concentration && blood_alcohol_concentration <= 0.1) {
    return "ほろ酔い期";
  } else if (0.1 < blood_alcohol_concentration && blood_alcohol_concentration <= 0.15) {
    return "酩酊初期";
  } else if (0.15 < blood_alcohol_concentration && blood_alcohol_concentration <= 0.3) {
    return "酩酊極期";
  } else if (0.3 < blood_alcohol_concentration && blood_alcohol_concentration <= 0.4) {
    return "泥酔期";
  } else {
    return "昏睡期";
  }
}

function message(status){
  switch(status){
    case 'シラフ':
      return 'お酒は適量で楽しみましょう。'
    case '爽快期':
      return '適度に水も飲みましょう。'
    case 'ほろ酔い期':
      return 'そろそろ水を飲みましょう。'
    case '酩酊初期':
      return 'ちょっと飲みすぎかも。'
    case '酩酊極期':
      return '飲みすぎです。今日はもう飲むのをやめましょう。'
    case '泥酔期':
      return '今すぐに飲むのを止めましょう！'
    case '昏睡期':
      return 'お前はもう死んでいる'
  }
}

router.get('/reset',function(req,res,next){
  req.session.destroy(function(err){
  });
  res.redirect('/');
})

module.exports = router;
