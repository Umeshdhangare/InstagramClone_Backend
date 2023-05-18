var express = require('express');
var postRouter = express.Router();

var authenticate = require('../middleware/authenticate');

var Posts = require('../models/posts');

// get and post on /posts
postRouter.route('/')
.get((req,res,next) => {
    Posts.find({})
        .populate('postedBy', 'name')
        .populate('comments.postedBy', 'name')
        .populate('likes','name')
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

// GET , POST and DELETE on /posts/id
postRouter.route('/:id')
.get((req,res,next) => {
    Posts.findById(req.params.id)
        .populate('postedBy', 'name')
        .populate('comments.postedBy', 'name')
        .populate('likes', 'name')
        .then((post) => {
            res.statusCode = 200;
            res.json(post);
        })
        .catch((err) => next(err));
})
.post((req,res) => {
    res.statusCode = 403;
    res.send("POST method not supported on this endpoint");
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Posts.findById(req.params.id)
        .then((post) => {
            if(!post){
                res.statusCode = 404;
                res.send("No post available!");
            }

            Posts.deleteOne({_id: req.params.id})
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json({message: "Post deleted successfully!"});
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

// POST Likes and comments on /posts/id/likes and /posts/id/comments respectively
postRouter.route('/:id/likes')
.post(authenticate.verifyUser, (req,res,next) => {
    Posts.findByIdAndUpdate(req.params.id, {
        $push : {likes: req.user.id}
    }, {
        new: true
    })
    .populate('likes', 'name')
    .exec()
    .then((result) => {
        res.statusCode = 200;
        res.json(result);
    })   
    .catch((err) => next(err)); 
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Posts.findByIdAndUpdate(req.params.id, {
        $pull: {likes: req.user.id}
    }, {
        new: true
    })
    .populate('likes', 'name')
    .exec()
    .then((result) => {
        res.statusCode = 200;
        res.json(result);
    })
    .catch((err) => next(err));
});

postRouter.route('/:id/comment')
.post(authenticate.verifyUser, (req,res,next) => {
    var comment = {
        text: req.body.text,
        postedBy: req.user._id
    };

    Posts.findByIdAndUpdate(req.params.id,{
        $push: {comments: comment}
    }, {
        new: true
    })
    .populate('comments.postedBy', 'name')
    .exec()
    .then((result) => {
        res.statusCode = 200;
        res.json(result);
    })
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    var updatedComment = req.body.text;

    Posts.findById(req.params.id)
        .then((post)=>{
            for(let comment of post.comments){
                if(comment.postedBy.toString() === req.user.id.toString()){
                    comment.text = updatedComment;
                    break;
                }
            }
            post.save()
                .then((savedPost) => {
                    return Posts.populate(savedPost, {path: 'comments.postedBy', select:'name'})
                })
                .then((updatedPost) => {
                    res.statusCode  = 200;
                    res.json(updatedPost);
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});

module.exports = postRouter;