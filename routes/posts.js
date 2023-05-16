const express = require('express');
const postRouter = express.Router();

const Post = require('../models/posts');

postRouter.route('/')
.get((req,res,next) => {
    Post.find({})
        // .populate('postedBy')
        // .populate('comments.postedBy')
        .then((posts) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(posts);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post((req,res,next) => {
    const {title, body} = req.body;
    if(!title || !body){
        res.sendStatus(422).json({message: "All fields are required"});
    }
    const newPost = new Post({
        title,
        body
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