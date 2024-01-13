const multer = require('multer');
const HttpError = require('../models/http-error');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const fileUpload = multer({
  limits: 500000,
  storage:multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new HttpError('Invalid mime type!',401);
    cb(error, isValid);
  }
});

module.exports = fileUpload;
