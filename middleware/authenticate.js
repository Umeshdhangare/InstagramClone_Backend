var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('../config');

var User = require('../models/user');

exports.verifyUser = (req,res,next) => {
    var {authorization} = req.headers;
    // console.log(authorization);

    var token = authorization.replace("Bearer ", "");
    
    jwt.verify(token, config.secretKey, (err, payload) => {
        if(err){
            res.json({message: "Email or Password is incorrect!"});
        }

        User.findOne({email: payload})
            .then((userData) => {
                req.user = userData;
                next();
            })
            .catch((err) => next(err));
    });
};