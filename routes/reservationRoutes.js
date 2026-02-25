const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: 创建预订
 *     tags: [预订]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelId: { type: integer, required: true, description: '酒店ID' }
 *               roomId: { type: integer, required: true, description: '房型ID' }
 *               checkIn: { type: string, required: true, format: date, description: '入住日期' }
 *               checkOut: { type: string, required: true, format: date, description: '退房日期' }
 *               contactName: { type: string, required: true, description: '联系人姓名' }
 *               contactPhone: { type: string, required: true, description: '联系人电话' }
 *               guests: { type: array, description: ' guest信息' }
 *               specialRequests: { type: string, description: '特殊要求' }
 *     responses:
 *       201: { description: '预订成功' }
 *       400: { description: '请求参数错误' }
 *       401: { description: '未授权' }
 */
router.post('/reservations', authMiddleware, roleMiddleware(['user']), ReservationController.createReservation);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: 获取用户预订列表
 *     tags: [预订]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *         description: 预订状态
 *     responses:
 *       200: { description: '获取成功' }
 *       401: { description: '未授权' }
 */
router.get('/reservations', authMiddleware, roleMiddleware(['user']), ReservationController.getUserReservations);

/**
 * @swagger
 * /reservations/{reservationId}:
 *   delete:
 *     summary: 取消预订
 *     tags: [预订]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema: { type: string }
 *         description: 预订编号
 *     responses:
 *       200: { description: '取消成功' }
 *       401: { description: '未授权' }
 *       404: { description: '预订不存在' }
 */
router.delete('/reservations/:reservationId', authMiddleware, roleMiddleware(['user']), ReservationController.cancelReservation);

module.exports = router;