const router = require("express").Router();
const storage = require("../lib/multer");
const {
  storageImage,
  storageVideo,
  storageFile,
  generateQR,
  imagekitUpload,
  gallery,
  updateImage,
  deleteImage,
} = require("../controller/media_controller");
const restrict = require("../middleware/restrict");

router.post("/image", storage.image.single("images"), restrict, storageImage);
router.post("/video", storage.video.single("videos"), storageVideo);
router.post("/file", storage.file.single("files"), storageFile);
router.post("/generate-qr", generateQR);

const multer = require("multer")();
router.post("/imagekit", multer.single("image"), restrict, imagekitUpload);
router.get("/gallery", restrict, gallery);
router.put("/gallery/:id", restrict, updateImage);
router.delete("/gallery/:id", restrict, deleteImage);
module.exports = router;
