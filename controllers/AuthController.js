const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/auth');

class AuthController {
  static async register(req, res) {
    try {
      const { username, password, email, phone, role } = req.body;

      if (!username || !password) {
        return res.error('用户名和密码不能为空');
      }

      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.error('用户名已存在');
      }

      if (email) {
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
          return res.error('邮箱已被注册');
        }
      }

      if (phone) {
        const existingPhone = await User.findByPhone(phone);
        if (existingPhone) {
          return res.error('手机号已被注册');
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await User.create({
        username,
        password: hashedPassword,
        email,
        phone,
        role: role || 'user'
      });

      const user = await User.findById(userId);
      res.success({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }, '注册成功', 200);
    } catch (error) {
      console.error('注册失败:', error);
      res.error('注册失败', 500);
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.error('用户名和密码不能为空');
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.error('用户名或密码错误');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.error('用户名或密码错误');
      }

      const token = generateToken(user);

      res.success({
        token,
        expiresIn: 86400,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }, '登录成功');
    } catch (error) {
      console.error('登录失败:', error);
      res.error('登录失败', 500);
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.error('用户不存在', 404);
      }

      res.success({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.created_at
      });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      res.error('获取用户信息失败', 500);
    }
  }
}

module.exports = AuthController;