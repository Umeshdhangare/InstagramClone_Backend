const router = require("express").Router();
const authController = require("../middleware/authController");
const commentController = require("../middleware/commentController");

router.post("/", authController.verify, commentController.addComment);
router.get("/:postId", commentController.getbyPostId);

module.exports = router;