const express = require('express');
const router = express.Router();
const PublicHotelController = require('../controllers/PublicHotelController');

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: 搜索酒店
 *     tags: [公共酒店]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *         description: 城市
 *       - in: query
 *         name: keyword
 *         schema: { type: string }
 *         description: 关键词
 *       - in: query
 *         name: star
 *         schema: { type: string }
 *         description: 星级
 *       - in: query
 *         name: priceMin
 *         schema: { type: number }
 *         description: 最低价格
 *       - in: query
 *         name: priceMax
 *         schema: { type: number }
 *         description: 最高价格
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *         description: 排序方式
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer }
 *         description: 每页数量
 *     responses:
 *       200: { description: '搜索成功' }
 */
router.get('/hotels', PublicHotelController.searchHotels);

/**
 * @swagger
 * /hotels/{hotelId}:
 *   get:
 *     summary: 获取酒店详情
 *     tags: [公共酒店]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema: { type: integer }
 *         description: 酒店ID
 *       - in: query
 *         name: checkIn
 *         schema: { type: string, format: date }
 *         description: 入住日期（可选）
 *       - in: query
 *         name: checkOut
 *         schema: { type: string, format: date }
 *         description: 退房日期（可选）
 *     responses:
 *       200: { description: '获取成功' }
 *       404: { description: '酒店不存在' }
 */
router.get('/hotels/:hotelId', PublicHotelController.getHotelDetail);

/**
 * @swagger
 * /hotels/{hotelId}/price-calendar:
 *   get:
 *     summary: 获取价格日历
 *     tags: [公共酒店]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema: { type: integer }
 *         description: 酒店ID
 *       - in: query
 *         name: yearMonth
 *         schema: { type: string, format: date }
 *         description: 年月（格式：YYYY-MM）
 *     responses:
 *       200: { description: '获取成功' }
 */
router.get('/hotels/:hotelId/price-calendar', PublicHotelController.getPriceCalendar);

module.exports = router;