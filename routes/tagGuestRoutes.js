const express = require('express');
const router = express.Router();
const TagGuestController = require('../controllers/TagGuestController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/tags', TagGuestController.getAllTags);
router.post('/tags', authMiddleware, roleMiddleware(['merchant']), TagGuestController.createTag);
router.post('/guests', authMiddleware, TagGuestController.createGuest);
router.get('/guests', authMiddleware, TagGuestController.getGuests);
router.delete('/guests/:guestId', authMiddleware, TagGuestController.deleteGuest);

module.exports = router;