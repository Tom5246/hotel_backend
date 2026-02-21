const express = require('express');
const router = express.Router();
const PublicHotelController = require('../controllers/PublicHotelController');

router.get('/hotels', PublicHotelController.searchHotels);
router.get('/hotels/:hotelId', PublicHotelController.getHotelDetail);
router.get('/hotels/:hotelId/price-calendar', PublicHotelController.getPriceCalendar);

module.exports = router;