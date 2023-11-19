const router = require("express").Router();
const storage = require("../lib/multer");
const {
  imagekitUpload,
  gallery,
  updateImage,
  deleteImage,
  whoami,
} = require("../controller/user_controller");
const restrict = require("../middleware/restrict");
const { Auth } = require("../middleware/jwt");

const multer = require("multer")();
router.post("/imagekit", multer.single("image"), Auth, imagekitUpload);
router.get("/gallery", restrict, gallery);
router.get("/gallery.ejs", Auth, gallery);
router.put("/gallery/:id", Auth, updateImage);
router.delete("/gallery/:id", Auth, deleteImage);
router.get("/whoami", Auth, whoami);
module.exports = router;
