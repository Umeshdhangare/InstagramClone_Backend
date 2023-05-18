var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config');
var authenticate = require('../middleware/authenticate');

var Users = require('../models/user');
var Posts = require('../models/posts');

var saltRounds = 1;

// Signing Up
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

// Logging Up
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

// GET user information who is currently logged in
router.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
  Users.findOne({_id: req.user.id})
    .select('-password')
    .populate('followers', 'name')
    .populate('following', 'name')
    .exec()
    .then((user) => {
      res.statusCode = 200;
      res.json(user);
    })
    .catch((err) => next(err));
});

// GET all posts for user on endpoint /id
router.route('/:id')
.get(authenticate.verifyUser, (req,res,next) => {
  Users.findById(req.params.id)
    .select('-password')
    .exec()
    .then((user) => {
        Posts.find({postedBy: req.params.id})
          .populate('postedBy', 'name email')
          .populate('likes', 'name')
          .populate('comments.postedBy', 'name')
          .exec()
          .then((posts) => {
            res.statusCode = 200;
            res.json({posts, user});
          }, (err) => next(err))
          .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.route('/:id/follow')
.post(authenticate.verifyUser, (req,res,next) => {
    Users.findByIdAndUpdate(req.user.id, {
      $push: {following: req.params.id}
    }, {
      new: true
    })
      .exec()
      .then((user) => {
        Users.findByIdAndUpdate(req.params.id, {
          $push: {followers: req.user.id}
        }, {
          new: true
        })
          .exec()
          .then((result) => {
            res.statusCode = 200;
            res.json({user, result});
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
})

router.post('/:id/unfollow', (req,res,next) => {
  Users.findByIdAndUpdate(req.user.id, {
    $pull: {following: req.params.id}
  }, {
    new: true
  })
    .exec()
    .then((user) => {
      Users.findByIdAndUpdate(req.params.id, {
        $pull: {followers: req.user.id}
      },{
        new: true
      })
      .exec()
      .then((result) => {
        res.statusCode = 200;
        res.json({user, result});
      })
      .catch((err) => next(err))
    })
    .catch((err) => next(err))
})

module.exports = router;
