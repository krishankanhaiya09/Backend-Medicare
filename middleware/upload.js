
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|pdf/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime =
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf";

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;