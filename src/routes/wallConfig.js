const express = require("express");
const router = express.Router();
const {
  createWallConfig,
  getWallConfigs,
  getWallConfigBySlug,
  updateWallConfig,
  deleteWallConfig
} = require("../controllers/wallConfigController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.post("/", protect, adminOnly, createWallConfig);
router.get("/", getWallConfigs);
router.get("/slug/:slug", getWallConfigBySlug);
router.put("/:id", protect, adminOnly, updateWallConfig);
router.delete("/:id", protect, adminOnly, deleteWallConfig);

module.exports = router;
