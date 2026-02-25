require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const { testConnection } = require('./config/db');
const responseFormatter = require('./middleware/responseFormatter');

// Swagger UI 配置（可选）
try {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./config/swagger');
  // Swagger UI 路由
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI 已启用，访问地址: http://localhost:3000/api-docs');
} catch (error) {
  console.log('Swagger UI 依赖未安装，跳过 Swagger 配置');
  console.log('安装命令: npm install swagger-ui-express swagger-jsdoc');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseFormatter);

app.get('/', (req, res) => {
  res.success({ message: '易宿酒店预订平台 API' });
});

const authRoutes = require('./routes/authRoutes');
const publicHotelRoutes = require('./routes/publicHotelRoutes');
const merchantRoutes = require('./routes/merchantRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const tagGuestRoutes = require('./routes/tagGuestRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api', authRoutes);
app.use('/api', publicHotelRoutes);
app.use('/api', merchantRoutes);
app.use('/api', adminRoutes);
app.use('/api', reservationRoutes);
app.use('/api', tagGuestRoutes);
app.use('/api', uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.error('服务器内部错误', 500);
});

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await testConnection();
});