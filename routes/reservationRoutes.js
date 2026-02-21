const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/reservations', authMiddleware, roleMiddleware(['user']), ReservationController.createReservation);
router.get('/reservations', authMiddleware, roleMiddleware(['user']), ReservationController.getUserReservations);
router.delete('/reservations/:reservationId', authMiddleware, roleMiddleware(['user']), ReservationController.cancelReservation);

module.exports = router;