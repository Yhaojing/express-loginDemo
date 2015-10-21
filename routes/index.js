var express = require('express');
var router = express.Router();

//注册页面
router.get('/auth/singup', function (req, res) {
  console.log(req);
  res.render('register');
});
//登录页面
router.get('/auth/singin', function (req, res) {
  res.render('index');
});
//验证页面
router.get('/auth/check', function (req, res) {
  res.render('check')
});

//router.post('/auth/check',)
//router.post('/auth/singin',)
//router.post('/auth/singup',)



module.exports = router;
