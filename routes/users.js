var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config');

var Users = require('../models/user');

var saltRounds = 1;

router.post('/signup', (req,res,next) => {
    // console.log(req.body);
    var {email, password} = req.body;

    if(!email || !password){
      res.statusCode = 422;
      res.setHeader('Content-Type','application/json');
      res.json({message: "All fields are required"});
    }

    Users.findOne({email: email})
      .then((existingUser) => {
        if(existingUser){
          res.statusCode = 403;
          res.setHeader('Content-Type','application/json');
          res.json({message: "Already user, please log in!"});
        }
      })
      .catch((err) => next(err));

    bcrypt.hash(password, saltRounds)
      .then((hashPassword) => {
        var {name} = req.body;
        var newUser = new Users({
          email,
          password: hashPassword,
          name
        });
    
        newUser.save()
          .then((user) => {
            res.status = 200;
            res.setHeader('Content-Type','application/json');
            res.json({user: user, message: 'Successfully SignUp'});
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
});

router.post('/login', (req,res,next) => {
  var {email, password} = req.body;

  if(!email || !password){
    res.statusCode = 422;
    res.setHeader('Content-Type','application/json');
    res.json({message: "All fields are required"});
  }

  Users.findOne({email: email})
    .then((existingUser) => {
      if(!existingUser){
        res.statusCode = 404;
        res.json({message: "You are not user, Please sign up"});
      }

      bcrypt.compare(password, existingUser.password)
        .then((isMatch) => {
          if(!isMatch){
            res.statusCode = 404;
            res.json({message: "Your password is incorrect!"});
          }
          
          var token = jwt.sign(email, config.secretKey);
          res.statusCode = 200;
          res.json({token: token, message: "Login Successfully!"});
        }, (err) => next(err))
        .catch((err) => next(err));

    })
    .catch((err) => next(err));
});

module.exports = router;
