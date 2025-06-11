const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getDisplayMedia,
  getMediaById,
  createDisplayMedia,
  updateDisplayMedia,
  deleteDisplayMedia
} = require("../controllers/displayMediaController");

const upload = require("../middlewares/uploadMiddleware");

// Protected Routes (Admin Only)

router.put("/:id", protect, adminOnly, upload.single("image"), updateDisplayMedia);
router.delete("/:id", protect, adminOnly, deleteDisplayMedia);

// Public Routes

router.post("/", upload.single("image"), createDisplayMedia);
router.get("/", getDisplayMedia);
router.get("/:id", getMediaById);

module.exports = router;
