/**
 * Created by haojing on 15/10/20.
 */
var model = require('../model/db').model;
var bcrypt = require('bcrypt');
var superagent = require('superagent');
var hash = require('./pass').hash;
var redis = require('redis');
var client = redis.createClient();
//客户端请求代理
var winston = require('winston');
//手机验证（是否被注册是否是11位）
//密码加密保存

function setCode () {
    var code = '';
    for(var i = 0; i < 6; i++){
        code += Math.floor(Math.random()*10);
    }
    return code;
}
//接发送短信的端口
function send (phone_number, code) {
    winston.info(phone_number);
//    ...
};


exports.sendcode = function (req, res) {
    //console.log(setCode());
    var code = setCode();
    //req.session.verification = code;
    client.hset(req.session.phone, 'code', code, redis.print);
    //console.log(req.session.verification)
    console.log(code);
    send(req.session.phone, code);
}

exports.create = function create (req, res) {
    var username = req.body.username;
    var pwd = req.body.pwd;
    var phone = req.body.phone;
    var reg = /\d{11}/g;
    //console.log(username);
    model.find({phone: phone}, function (err, user) {
        if(!reg.test(phone)) {
            //req.locals.message = '电话号码输入错误请重新输入';
            res.render('register', {message: '电话号码输入错误请重新输入'})
        } else if(user.length !== 0) {
            res.render('register', {message: '该电话号码已经被注册，可直接登录'})
        } else {
            //model.create({phone: phone, hash: hash(pwd), name:})
            hash(pwd, function (err, salt, hash) {
                req.session.phone = phone;
                req.session.username = username;
                req.session.hash = hash;
                req.session.salt = salt;
                res.render('check')
            })

        }
    })

}
function createUser (req, res) {
    console.log('验证码：',req.body.code);
    client.hgetall (req.session.phone, function (err, replies) {
        console.log(replies);
        if(replies.code === req.body.code) {
            model.create({
                name: req.session.username,
                hash: req.session.hash,
                phone: req.session.phone,
                code: req.body.code,
                salt: req.session.salt
            }, function(err, doc) {
                res.render('home')
            })

        }

    })

}
function login (req, res) {
    model.find({name: req.body.username}, function (err, user) {
        console.log(user);
        if(user.length === 0) {
           return res.render('index', {message: '该用户没有注册'})
        }

        hash(req.body.pwd, user[0].salt, function (err, hash) {
            if(hash === user[0].hash) {
                req.session.user = user[0];
                return res.render('home');
            } else {
               return res.render('index', {message: '密码输入错误'});
            }
        })
    })
}
exports.createUser = createUser;
exports.login = login;