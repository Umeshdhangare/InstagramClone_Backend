const Comment = require("../models/comment");
const Post = require("../models/posts");

const addComment = async (req, res) => {
    try {
        const {...comment} = req.body;
        const postId = req.params.postId;
        comment.user = req.user._id;
        const commentosave = new Comment(comment);
        const savedcomment = await commentosave.save();

        await Post.findOneAndUpdate(
            {_id:postId},
            {$push: {comments: savedcomment._id}}
        );

        res.status(200).send({
            status:"success",
            message: "Comment has been created"
        });
    } catch(e) {
        res.status(500).send({
            status:"failure",
            message:e.message
        })
    }
}

const getbyPostId = async (req,res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findOne({
            _id: postId
        }).populate("comments");
        res.status(200).send({
            status:"success",
            comments:post.comments
        });
    } catch(e) {
        res.status(500).send({
            status:"failure",
            message:e.message
        })
    }
}

module.exports = {addComment, getbyPostId};