/**
 * Created by haojing on 15/10/20.
 */
var mongooose = require('mongoose');
var db = mongooose.createConnection('mongodb://localhost/user');
db.on('error', function (error) {
    console.log('连接数据库失败', error);
})

db.on('open', function () {
    console.log('连接数据库成功');
})
var UserSchema = mongooose.Schema({
    name: String,
    hash: String,
    phone: String,
    code: String,
    salt: String,
})


var model = db.model('loginUser', UserSchema);
exports.model = model;
//model.remove({}, function (error) {
//    if(error) {
//        console.log('delete false');
//    } else {
//        console.log('delete success');
//    }
//})