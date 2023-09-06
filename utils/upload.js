const path = require("path");
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination:(req, file, cb) =>{
    cb(null, "./public/");
  },
  filename: (req, file, cb) =>{
    console.log(path.extname(file.originalname))
    cb(null, `image-${Date.now()}` + path.extname(file.originalname));
  },
});
const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|svg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Image type not correct. png, jpg,svg"));
    }
    cb(null, true);
  };
  const upload =multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  module.exports = upload;