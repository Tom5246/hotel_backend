const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/admin/hotels/pending', authMiddleware, roleMiddleware(['admin']), AdminController.getPendingHotels);
router.post('/admin/hotels/:hotelId/audit', authMiddleware, roleMiddleware(['admin']), AdminController.auditHotel);
router.post('/admin/hotels/:hotelId/publish', authMiddleware, roleMiddleware(['admin']), AdminController.publishHotel);
router.get('/admin/hotels', authMiddleware, roleMiddleware(['admin']), AdminController.getAllHotels);

module.exports = router;