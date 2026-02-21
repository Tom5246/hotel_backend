const Tag = require('../models/Tag');
const Guest = require('../models/Guest');

class TagGuestController {
  static async getAllTags(req, res) {
    try {
      const tags = await Tag.findAll();
      res.success(tags);
    } catch (error) {
      console.error('获取标签列表失败:', error);
      res.error('获取标签列表失败', 500);
    }
  }

  static async createTag(req, res) {
    try {
      const { name, category } = req.body;

      if (!name) {
        return res.error('标签名称不能为空');
      }

      const tagId = await Tag.create({ name, category });
      const tag = await Tag.findById(tagId);

      res.success(tag, '创建成功', 201);
    } catch (error) {
      console.error('创建标签失败:', error);
      res.error('创建标签失败', 500);
    }
  }

  static async createGuest(req, res) {
    try {
      const { firstName, lastName, idType, idNumber, phone } = req.body;
      const userId = req.user.id;

      if (!firstName || !lastName || !idType || !idNumber) {
        return res.error('姓名、证件类型和证件号码不能为空');
      }

      const guestId = await Guest.create({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        id_type: idType,
        id_number: idNumber,
        phone
      });

      const guest = await Guest.findById(guestId);
      res.success({
        id: guest.id,
        firstName: guest.first_name,
        lastName: guest.last_name,
        idType: guest.id_type,
        idNumber: guest.id_number,
        phone: guest.phone,
        createdAt: guest.created_at
      }, '创建成功', 201);
    } catch (error) {
      console.error('创建入住人失败:', error);
      res.error('创建入住人失败', 500);
    }
  }

  static async getGuests(req, res) {
    try {
      const userId = req.user.id;
      const { page, pageSize } = req.query;

      const filters = {};
      if (page) filters.page = parseInt(page);
      if (pageSize) filters.pageSize = parseInt(pageSize);

      const guests = await Guest.findByUserId(userId, filters);
      const total = await Guest.countByUserId(userId);

      const currentPage = parseInt(page) || 1;
      const currentPageSize = Math.min(parseInt(pageSize) || 10, 50);

      res.success({
        total,
        page: currentPage,
        pageSize: currentPageSize,
        items: guests
      });
    } catch (error) {
      console.error('获取入住人列表失败:', error);
      res.error('获取入住人列表失败', 500);
    }
  }

  static async deleteGuest(req, res) {
    try {
      const guestId = req.params.guestId;
      const userId = req.user.id;

      const guest = await Guest.findById(guestId);
      if (!guest) {
        return res.error('入住人不存在', 404);
      }

      if (guest.user_id !== userId) {
        return res.error('无权删除此入住人', 403);
      }

      await Guest.delete(guestId);
      res.success(null, '删除成功');
    } catch (error) {
      console.error('删除入住人失败:', error);
      res.error('删除入住人失败', 500);
    }
  }
}

module.exports = TagGuestController;