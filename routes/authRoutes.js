const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 用户注册
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, required: true, description: '用户名' }
 *               password: { type: string, required: true, description: '密码' }
 *               email: { type: string, required: true, description: '邮箱' }
 *               phone: { type: string, required: true, description: '手机号' }
 *               role: { type: string, required: true, description: '角色 (user/merchant/admin)' }
 *     responses:
 *       201: { description: '注册成功' }
 *       400: { description: '请求参数错误' }
 */
router.post('/auth/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, required: true, description: '用户名' }
 *               password: { type: string, required: true, description: '密码' }
 *     responses:
 *       200: { description: '登录成功' }
 *       400: { description: '用户名或密码错误' }
 */
router.post('/auth/login', AuthController.login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: 获取个人资料
 *     tags: [认证]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: '获取成功' }
 *       401: { description: '未授权' }
 */
router.get('/auth/profile', authMiddleware, AuthController.getProfile);

module.exports = router;