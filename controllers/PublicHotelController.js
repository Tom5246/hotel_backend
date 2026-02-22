const Hotel = require('../models/Hotel');
const Tag = require('../models/Tag');

class PublicHotelController {
  static async searchHotels(req, res) {
    try {
      const { city, keyword, checkIn, checkOut, star, priceMin, priceMax, tags, sort, page, pageSize } = req.body;
      
      const filters = {};
      if (city) filters.city = city;
      if (keyword) filters.keyword = keyword;
      if (star) filters.star = star;
      if (priceMin) filters.priceMin = parseFloat(priceMin);
      if (priceMax) filters.priceMax = parseFloat(priceMax);
      if (tags) filters.tags = tags;
      if (sort) filters.sort = sort;
      if (page) filters.page = parseInt(page);
      if (pageSize) filters.pageSize = parseInt(pageSize);

      const result = await Hotel.search(filters);
      
      const items = result.items.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        address: hotel.address,
        star: hotel.star,
        rating: hotel.rating,
        reviewCount: 0,
        price: hotel.price,
        image: hotel.image,
        tags: []
      }));

      res.success({
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        items
      });
    } catch (error) {
      console.error('查询酒店列表失败:', error);
      res.error('查询酒店列表失败', 500);
    }
  }

  static async getHotelDetail(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const { checkIn, checkOut } = req.body;

      const hotel = await Hotel.getHotelWithDetails(hotelId, checkIn, checkOut);

      if (!hotel) {
        return res.error('酒店不存在', 404);
      }

      res.success({
        id: hotel.id,
        name: hotel.name,
        address: hotel.address,
        description: hotel.description,
        star: hotel.star,
        rating: hotel.rating,
        openingDate: hotel.opening_date,
        images: hotel.images,
        tags: hotel.tags,
        rooms: hotel.rooms,
        promotions: []
      });
    } catch (error) {
      console.error('获取酒店详情失败:', error);
      res.error('获取酒店详情失败', 500);
    }
  }

  static async getPriceCalendar(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const { yearMonth } = req.body;

      const result = await Hotel.getPriceCalendar(hotelId, yearMonth);
      res.success(result);
    } catch (error) {
      console.error('获取价格日历失败:', error);
      res.error('获取价格日历失败', 500);
    }
  }
}

module.exports = PublicHotelController;