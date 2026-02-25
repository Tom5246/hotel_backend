const express = require('express');
const router = express.Router();
const MerchantController = require('../controllers/MerchantController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.memoryStorage(),
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

router.post('/merchant/hotels', authMiddleware, roleMiddleware(['merchant']), MerchantController.createHotel);
router.post('/merchant/hotels/upload', authMiddleware, roleMiddleware(['merchant']), upload.array('files', 10), MerchantController.createHotelWithUpload);
router.get('/merchant/hotels', authMiddleware, roleMiddleware(['merchant']), MerchantController.getMerchantHotels);
router.get('/merchant/hotels/:hotelId', authMiddleware, roleMiddleware(['merchant']), MerchantController.getMerchantHotel);
router.put('/merchant/hotels/:hotelId', authMiddleware, roleMiddleware(['merchant']), MerchantController.updateHotel);
router.delete('/merchant/hotels/:hotelId', authMiddleware, roleMiddleware(['merchant']), MerchantController.deleteHotel);
router.post('/merchant/hotels/:hotelId/rooms', authMiddleware, roleMiddleware(['merchant']), MerchantController.createRoom);
router.post('/merchant/hotels/:hotelId/rooms/upload', authMiddleware, roleMiddleware(['merchant']), upload.array('files', 10), MerchantController.createRoomWithUpload);
router.put('/merchant/rooms/:roomId', authMiddleware, roleMiddleware(['merchant']), MerchantController.updateRoom);
router.delete('/merchant/hotels/:hotelId/:roomId', authMiddleware, roleMiddleware(['merchant']), MerchantController.deleteRoom);
router.get('/merchant/hotels/:hotelId/rooms', authMiddleware, roleMiddleware(['merchant']), MerchantController.getHotelRooms);

module.exports = router;