const DisplayMedia = require("../models/DisplayMedia");
const response = require("../utils/response");
const { uploadToCloudinary, deleteImage } = require("../utils/cloudinary");
const asyncHandler = require("../middlewares/asyncHandler");

let io;

// ✅ Set WebSocket instance
exports.setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;
};

// ✅ Emit all media to connected screens
const emitMediaUpdate = async () => {
  try {
    if (!io) throw new Error("WebSocket instance not initialized.");
    const allMedia = await DisplayMedia.find().sort({ createdAt: -1 });
    io.emit("mediaUpdate", allMedia);
  } catch (err) {
    console.error("❌ Failed to emit media update:", err.message);
  }
};

// ✅ Get all media
exports.getDisplayMedia = asyncHandler(async (req, res) => {
  const items = await DisplayMedia.find().sort({ createdAt: -1 });
  return response(res, 200, items.length ? "Media fetched." : "No media found.", items);
});

// ✅ Get one media item by ID
exports.getMediaById = asyncHandler(async (req, res) => {
  const item = await DisplayMedia.findById(req.params.id);
  if (!item) return response(res, 404, "Media not found.");
  return response(res, 200, "Media retrieved.", item);
});

// ✅ Create new media
exports.createDisplayMedia = asyncHandler(async (req, res) => {
  const { text = "", mode } = req.body;

  if (!req.file) return response(res, 400, "Image file is required.");
  if (!mode || !["mosaic", "card"].includes(mode))
    return response(res, 400, "Invalid mode. Use 'mosaic' or 'card'.");

  const uploaded = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

  const media = await DisplayMedia.create({
    imageUrl: uploaded.secure_url,
    text,
    mode
  });

  await emitMediaUpdate();
  return response(res, 201, "Media created successfully.", media);
});

// ✅ Update media (only text or mode)
exports.updateDisplayMedia = asyncHandler(async (req, res) => {
  const item = await DisplayMedia.findById(req.params.id);
  if (!item) return response(res, 404, "Media not found.");

  const { text, mode } = req.body;

  if (text !== undefined) item.text = text;
  if (mode !== undefined && ["mosaic", "card"].includes(mode)) item.mode = mode;

  // Replace image if a new one is uploaded
  if (req.file) {
    await deleteImage(item.imageUrl);
    const uploaded = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    item.imageUrl = uploaded.secure_url;
  }

  await item.save();
  await emitMediaUpdate();
  return response(res, 200, "Media updated successfully.", item);
});

// ✅ Delete media
exports.deleteDisplayMedia = asyncHandler(async (req, res) => {
  const item = await DisplayMedia.findById(req.params.id);
  if (!item) return response(res, 404, "Media not found.");

  if (item.imageUrl) await deleteImage(item.imageUrl);
  await item.deleteOne();

  await emitMediaUpdate();
  return response(res, 200, "Media deleted successfully.");
});
