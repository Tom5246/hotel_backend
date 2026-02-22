const Hotel = require('../models/Hotel');

class AdminController {
  static async getPendingHotels(req, res) {
    try {
      const { page, pageSize } = req.body;

      const filters = {};
      if (page) filters.page = parseInt(page);
      if (pageSize) filters.pageSize = parseInt(pageSize);

      const result = await Hotel.getPendingHotels(filters);

      const items = result.items.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        merchant: {
          id: hotel.merchant_id,
          username: hotel.merchant_username
        },
        createdAt: hotel.created_at
      }));

      res.success({
        total: result.total,
        items
      });
    } catch (error) {
      console.error('获取待审核酒店列表失败:', error);
      res.error('获取待审核酒店列表失败', 500);
    }
  }

  static async auditHotel(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const { status, comment } = req.body;

      if (!status || !['approved', 'rejected'].includes(status)) {
        return res.error('无效的审核状态');
      }

      if (status === 'rejected' && !comment) {
        return res.error('拒绝时必须提供审核意见');
      }

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.error('酒店不存在', 404);
      }

      if (hotel.status !== 'pending') {
        return res.error('只能审核待审核状态的酒店');
      }

      await Hotel.updateStatus(hotelId, status, comment);

      const updatedHotel = await Hotel.findById(hotelId);
      res.success({
        id: updatedHotel.id,
        status: updatedHotel.status
      });
    } catch (error) {
      console.error('审核酒店失败:', error);
      res.error('审核酒店失败', 500);
    }
  }

  static async publishHotel(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const { action } = req.body;

      if (!action || !['publish', 'unpublish'].includes(action)) {
        return res.error('无效的操作');
      }

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.error('酒店不存在', 404);
      }

      if (action === 'publish' && hotel.status !== 'approved') {
        return res.error('只能上线已审核通过的酒店');
      }

      if (action === 'unpublish' && hotel.status !== 'published') {
        return res.error('只能下线已发布的酒店');
      }

      const newStatus = action === 'publish' ? 'published' : 'unpublished';
      await Hotel.updateStatus(hotelId, newStatus, null);

      const updatedHotel = await Hotel.findById(hotelId);
      res.success({
        id: updatedHotel.id,
        status: updatedHotel.status
      });
    } catch (error) {
      console.error('上线下线酒店失败:', error);
      res.error('上线下线酒店失败', 500);
    }
  }

  static async getAllHotels(req, res) {
    try {
      const { status, merchantId, page, pageSize } = req.body;
      
      const filters = {};
      if (status) filters.status = status;
      if (merchantId) filters.merchantId = parseInt(merchantId);
      if (page) filters.page = parseInt(page);
      if (pageSize) filters.pageSize = parseInt(pageSize);

      const result = await Hotel.getAllHotels(filters);
      res.success(result);
    } catch (error) {
      console.error('获取所有酒店失败:', error);
      res.error('获取所有酒店失败', 500);
    }
  }
}

module.exports = AdminController;