const { uploadFile } = require('../config/oss');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: function(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

class UploadController {
  static uploadSingle = upload.single('file');
  
  static async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.error('请选择要上传的文件', 400);
      }

      const folder = req.body.folder || 'images';
      const result = await uploadFile(req.file, folder);

      res.success({
        url: result.url,
        name: result.name,
        size: result.size
      }, '上传成功');
    } catch (error) {
      console.error('上传失败:', error);
      res.error(error.message || '上传失败', 500);
    }
  }

  static async uploadMultiple(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.error('请选择要上传的文件', 400);
      }

      const folder = req.body.folder || 'images';
      const uploadPromises = req.files.map(file => uploadFile(file, folder));
      const results = await Promise.all(uploadPromises);

      res.success({
        files: results.map(r => ({
          url: r.url,
          name: r.name,
          size: r.size
        }))
      }, '上传成功');
    } catch (error) {
      console.error('批量上传失败:', error);
      res.error(error.message || '上传失败', 500);
    }
  }
}

module.exports = UploadController;