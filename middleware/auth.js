const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.error('未提供认证令牌', 401);
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.error('认证令牌格式错误', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.error('无效的认证令牌', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return res.error('认证令牌已过期', 401);
    }
    return res.error('认证失败', 401);
  }
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.error('未认证', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.error('权限不足', 403);
    }

    next();
  };
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authMiddleware,
  roleMiddleware,
  generateToken
};