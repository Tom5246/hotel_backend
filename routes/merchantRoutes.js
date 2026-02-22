const express = require('express');
const router = express.Router();
const MerchantController = require('../controllers/MerchantController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/merchant/hotels', authMiddleware, roleMiddleware(['merchant']), MerchantController.createHotel);
router.post('/merchant/hotels/upload', authMiddleware, roleMiddleware(['merchant']), upload.array('files', 10), MerchantController.createHotelWithUpload);
router.get('/merchant/hotels', authMiddleware, roleMiddleware(['merchant']), MerchantController.getMerchantHotels);
router.get('/merchant/hotels/:hotelId', authMiddleware, roleMiddleware(['merchant']), MerchantController.getMerchantHotel);
router.put('/merchant/hotels/:hotelId', authMiddleware, roleMiddleware(['merchant']), MerchantController.updateHotel);
router.delete('/merchant/hotels/:hotelId', authMiddleware, roleMiddleware(['merchant']), MerchantController.deleteHotel);
router.post('/merchant/hotels/:hotelId/rooms', authMiddleware, roleMiddleware(['merchant']), MerchantController.createRoom);
router.put('/merchant/rooms/:roomId', authMiddleware, roleMiddleware(['merchant']), MerchantController.updateRoom);
router.delete('/merchant/hotels/:hotelId/:roomId', authMiddleware, roleMiddleware(['merchant']), MerchantController.deleteRoom);
router.get('/merchant/hotels/:hotelId/rooms', authMiddleware, roleMiddleware(['merchant']), MerchantController.getHotelRooms);

module.exports = router;