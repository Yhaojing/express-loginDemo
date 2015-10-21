/**
 * Created by haojing on 15/10/13.
 */

/**
 * Module dependencies.
 */

var crypto = require('crypto');

/**
 * Bytesize.
 */

var len = 128;

/**
 * Iterations. ~300ms
 */

var iterations = 12000;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api public
 */
//异步的方法，通过伪随机码来加密迭代数次，利用sha1算法生成一个更加强壮的加密串。我们结合上面的 crypto.randomBytes 来生成一个强壮的加密串。
exports.hash = function (pwd, salt, fn) {
    if (3 === arguments.length) {
        crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
            fn(err, hash.toString('base64'));
        });
    } else {
        fn = salt;
        crypto.randomBytes(len, function(err, salt){
            if (err) return fn(err);
            salt = salt.toString('base64');
            crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
                if (err) return fn(err);
                fn(null, salt, hash.toString('base64'));
            });
        });
    }
};
