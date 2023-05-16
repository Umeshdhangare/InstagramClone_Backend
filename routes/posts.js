var express = require('express');
var postRouter = express.Router();

var authenticate = require('../middleware/authenticate');

var Posts = require('../models/posts');

postRouter.route('/')
.get((req,res,next) => {
    Posts.find({})
        .populate('postedBy', 'name email')
        // .populate('comments.postedBy')
        .then((posts) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(posts);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    var {title, body} = req.body;
    if(!title || !body){
        res.statusCode = 422;
        res.json({message: "All fields are required"});
    }
    var newPost = new Posts({
        title,
        body,
        postedBy: req.user._id
    });

    newPost.save()
        .then((post) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post);
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = postRouter;