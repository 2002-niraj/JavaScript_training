import multer from "multer";

//const storage = multer.memoryStorage();

const upload = multer({
  limits: {
    fileSize: 4000000,
  },
});

export default upload;