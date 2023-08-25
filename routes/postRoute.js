const router = require("express").Router();
const postController = require("../middleware/postController");
const authController = require("../middleware/authController");

router.post("/", authController.verify, postController.createPost);

router.get("/timeline", authController.verify, postController.getTimeline);
router.get("/u/:username", postController.getPostUser);
router.get("/:id", postController.getPost);
router.put("/:id", authController.verify, postController.updatePost);
router.delete("/:id", authController.verify, postController.deletePost);
router.get("/:id/like", authController.verify, postController.likeUnlike);

module.exports = router;