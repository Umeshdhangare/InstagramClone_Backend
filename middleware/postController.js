const Comment = require("../models/comment");
const Post = require("../models/posts");
const User = require("../models/user");

const createPost = async (req, res) => {
	req.body.user = req.user._id;
	const newPost = new Post(req.body);

	try {
		await newPost.save();
		res.status(200).send({
			status: "success",
			message: "Post has been created!",
		});
	} catch (e) {
		res.status(500).send({
			status: "failure",
			message: e.message,
		});
	}
};

const updatePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (req.user._id === post.user.toString()) {
			await post.updateOne({ $set: req.body });
			res.status(200).send({
				status: "success",
				message: "Post has been updated successfully!",
			});
		} else {
			res.status(401).send({
				status: "failure",
				message: "you are not authorized",
			});
		}
	} catch (e) {
		res.status(500).send({
			status: "failure",
			message: e.message,
		});
	}
};

const deletePost = async (req, res) => {
	try {
		const posttoDelete = await Post.findById(req.params.id);
		if (
			req.user._id === posttoDelete.user.toString() ||
			req.user.role === "admin"
		) {
			await Comment.deleteMany({ user: req.user._id });
			await Post.findByIdAndDelete(req.params.id);
			res.status(200).send({
				status: "success",
				message: "post has been deleted successfully!",
			});
		} else {
			res.status(401).send({
				status: "failure",
				message: "you are not authorized!",
			});
		}
	} catch (e) {
		res.status(500).send({
			status: "failure",
			message: e.message,
		});
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id }).populate(
			"comments"
		);
		res.status(200).json(post);
	} catch (e) {
		res.status(500).send({
			status: "failure",
			message: e.message,
		});
	}
};

const getPostUser = async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username });
		const posts = await Post.find({ user: user._id });
		res.status(200).json(posts);
	} catch (e) {
		res.status(500).send({
			status: "failure",
			message: e.message,
		});
	}
};

const getTimeline = async (req, res) => {
	try {
		const userid = req.user._id;
		// const page = parseInt(req.query.page)-1 || 0;
		// const limit = parseInt(req.query.limit) || 1;
		const user = await User.findById(userid).select("followings");
		const myPosts = await Post.find({ user: userid })
			.sort({ createdAt: "desc" })
			.populate("user", "username profilePicture");

		const followingsPosts = await Promise.all(
			user.followings.map((followingId) => {
				return Post.findById(followingId)
					.sort({ createdAt: "desc" })
					.populate("user", "username profilePicture");
			})
		);

		// arr = myPosts.concat(...followingsPosts);

		res.status(200).send({
			status: "success",
			posts: myPosts,
			limit: myPosts.length,
		});
	} catch (e) {
		res.status(500).send({
			status: "failure",
			message: e.message,
		});
	}
};

const likeUnlike = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.user._id)) {
			await post.updateOne({ $push: { likes: req.user._id } });
			res.status(200).send({
				status: "success",
				message: "the post has been liked",
			});
		} else {
			await post.updateOne({ $pull: { likes: req.user._id } });
			res.status(200).send({
				status: "success",
				message: "the post has been disliked",
			});
		}
	} catch (error) {
		res.status(500).send({
			status: "failure",
			message: error.message,
		});
	}
};

module.exports = {
	getPost,
	createPost,
	updatePost,
	deletePost,
	getPostUser,
	getTimeline,
	likeUnlike,
};
