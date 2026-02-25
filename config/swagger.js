const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '酒店管理系统 API',
      version: '1.0.0',
      description: '酒店管理系统后端API接口文档',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: '本地开发服务器'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT认证令牌'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: '用户ID'
            },
            username: {
              type: 'string',
              description: '用户名'
            },
            email: {
              type: 'string',
              description: '邮箱'
            },
            phone: {
              type: 'string',
              description: '手机号'
            },
            role: {
              type: 'string',
              description: '角色'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间'
            }
          }
        },
        Hotel: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: '酒店ID'
            },
            name: {
              type: 'string',
              description: '酒店名称'
            },
            address: {
              type: 'string',
              description: '酒店地址'
            },
            star: {
              type: 'string',
              description: '酒店星级'
            },
            rating: {
              type: 'number',
              description: '酒店评分'
            },
            openingDate: {
              type: 'string',
              format: 'date',
              description: '开业时间'
            }
          }
        },
        Room: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: '房型ID'
            },
            hotelId: {
              type: 'integer',
              description: '酒店ID'
            },
            type: {
              type: 'string',
              description: '房型名称'
            },
            price: {
              type: 'number',
              description: '价格'
            },
            totalRooms: {
              type: 'integer',
              description: '总房间数'
            },
            available: {
              type: 'integer',
              description: '可用房间数'
            }
          }
        },
        Reservation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: '预订编号'
            },
            hotelName: {
              type: 'string',
              description: '酒店名称'
            },
            roomType: {
              type: 'string',
              description: '房型名称'
            },
            checkIn: {
              type: 'string',
              format: 'date',
              description: '入住日期'
            },
            checkOut: {
              type: 'string',
              format: 'date',
              description: '退房日期'
            },
            totalPrice: {
              type: 'number',
              description: '总价格'
            },
            status: {
              type: 'string',
              description: '预订状态'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              description: '错误代码'
            },
            message: {
              type: 'string',
              description: '错误消息'
            }
          }
        }
      }
    }
  },
  apis: ['routes/*.js', 'controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;