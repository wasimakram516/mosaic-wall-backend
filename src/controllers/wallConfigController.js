const WallConfig = require("../models/WallConfig");
const response = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const { generateUniqueSlug } = require("../utils/slugGenerator");

// ✅ Create wall config
exports.createWallConfig = asyncHandler(async (req, res) => {
  const { name, slug, mode } = req.body;
  if (!name || !slug || !["mosaic", "card"].includes(mode)) {
    return response(res, 400, "Name, slug, and valid mode are required.");
  }

  const finalSlug = await generateUniqueSlug(WallConfig, "slug", slug);

  const wall = await WallConfig.create({
    name,
    slug: finalSlug,
    mode,
    createdBy: req.user.id,
  });

  return response(res, 201, "Wall configuration created.", wall);
});

// ✅ Update wall config
exports.updateWallConfig = asyncHandler(async (req, res) => {
  const wall = await WallConfig.findById(req.params.id);
  if (!wall) return response(res, 404, "Wall configuration not found.");

  const { name, slug, mode } = req.body;

  if (name) wall.name = name;
  if (mode && ["mosaic", "card"].includes(mode)) wall.mode = mode;

  if (slug && slug !== wall.slug) {
    wall.slug = await generateUniqueSlug(WallConfig, "slug", slug);
  }

  await wall.save();
  return response(res, 200, "Wall configuration updated.", wall);
});

// ✅ Get all wall configs
exports.getWallConfigs = asyncHandler(async (req, res) => {
  const configs = await WallConfig.find().sort({ createdAt: -1 });
  return response(res, 200, "Wall configurations fetched.", configs);
});

// ✅ Get single wall config
exports.getWallConfigBySlug = asyncHandler(async (req, res) => {
  const config = await WallConfig.findOne({ slug: req.params.slug });
  if (!config) return response(res, 404, "Wall configuration not found.");
  return response(res, 200, "Wall configuration retrieved.", config);
});

// ✅ Delete wall config
exports.deleteWallConfig = asyncHandler(async (req, res) => {
  const config = await WallConfig.findById(req.params.id);
  if (!config) return response(res, 404, "Wall configuration not found.");

  await config.deleteOne();
  return response(res, 200, "Wall configuration deleted.");
});
