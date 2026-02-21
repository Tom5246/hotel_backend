const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const HotelImage = require('../models/HotelImage');
const Tag = require('../models/Tag');
const Facility = require('../models/Facility');

class MerchantController {
  static async createHotel(req, res) {
    try {
      const { name, address, description, star, openingDate, images, facilityIds, tagIds } = req.body;
      const merchantId = req.user.id;

      if (!name || !address) {
        return res.error('酒店名称和地址不能为空');
      }

      const completedOpeningDate = MerchantController.completeOpeningDate(openingDate);

      const hotelId = await Hotel.create({
        merchant_id: merchantId,
        name,
        address,
        description,
        star,
        rating: 0.0,
        opening_date: completedOpeningDate,
        status: 'pending'
      });

      if (images && images.length > 0) {
        for (const image of images) {
          await HotelImage.create({
            hotel_id: hotelId,
            url: image.url,
            type: image.type || 'other',
            sort_order: 0
          });
        }
      }

      if (facilityIds && facilityIds.length > 0) {
        for (const facilityId of facilityIds) {
          await Facility.addFacilityToHotel(hotelId, facilityId);
        }
      }

      if (tagIds && tagIds.length > 0) {
        for (const tagId of tagIds) {
          await Tag.addTagToHotel(hotelId, tagId);
        }
      }

      const hotel = await Hotel.findById(hotelId);
      res.success({
        id: hotel.id,
        status: hotel.status,
        createdAt: hotel.created_at
      }, '创建成功', 201);
    } catch (error) {
      console.error('创建酒店失败:', error);
      res.error('创建酒店失败', 500);
    }
  }

  static completeOpeningDate(openingDate) {
    if (!openingDate) {
      return null;
    }

    const parts = openingDate.split('-');
    
    if (parts.length === 1) {
      return `${openingDate}-01-01`;
    } else if (parts.length === 2) {
      return `${openingDate}-01`;
    }
    
    return openingDate;
  }

  static async getMerchantHotels(req, res) {
    try {
      const merchantId = req.user.id;
      const { status, page, pageSize } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (page) filters.page = parseInt(page);
      if (pageSize) filters.pageSize = parseInt(pageSize);

      const result = await Hotel.findByMerchantId(merchantId, filters);
      
      const total = result.length;
      const currentPage = parseInt(page) || 1;
      const currentPageSize = parseInt(pageSize) || 10;

      res.success({
        total,
        page: currentPage,
        pageSize: currentPageSize,
        items: result
      });
    } catch (error) {
      console.error('获取商户酒店列表失败:', error);
      res.error('获取商户酒店列表失败', 500);
    }
  }

  static async getMerchantHotel(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const merchantId = req.user.id;

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.error('酒店不存在', 404);
      }

      if (hotel.merchant_id !== merchantId) {
        return res.error('无权访问此酒店', 403);
      }

      const hotelWithDetails = await Hotel.getHotelWithDetails(hotelId);

      res.success({
        id: hotelWithDetails.id,
        name: hotelWithDetails.name,
        address: hotelWithDetails.address,
        description: hotelWithDetails.description,
        star: hotelWithDetails.star,
        rating: hotelWithDetails.rating,
        openingDate: hotelWithDetails.opening_date,
        merchantId: hotelWithDetails.merchant_id,
        status: hotelWithDetails.status,
        auditComment: hotelWithDetails.audit_comment,
        images: hotelWithDetails.images,
        tags: hotelWithDetails.tags,
        rooms: hotelWithDetails.rooms,
        createdAt: hotelWithDetails.created_at,
        updatedAt: hotelWithDetails.updated_at
      });
    } catch (error) {
      console.error('获取酒店信息失败:', error);
      res.error('获取酒店信息失败', 500);
    }
  }

  static async updateHotel(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const merchantId = req.user.id;
      const { name, address, description, star, openingDate, images, facilityIds, tagIds } = req.body;

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.error('酒店不存在', 404);
      }

      if (hotel.merchant_id !== merchantId) {
        return res.error('无权修改此酒店', 403);
      }

      const completedOpeningDate = MerchantController.completeOpeningDate(openingDate);

      await Hotel.update(hotelId, {
        name: name || hotel.name,
        address: address || hotel.address,
        description: description !== undefined ? description : hotel.description,
        star: star !== undefined ? star : hotel.star,
        rating: hotel.rating,
        opening_date: completedOpeningDate || hotel.opening_date,
        status: 'pending',
        audit_comment: null
      });

      if (images) {
        await HotelImage.deleteByHotelId(hotelId);
        for (const image of images) {
          await HotelImage.create({
            hotel_id: hotelId,
            url: image.url,
            type: image.type || 'other',
            sort_order: 0
          });
        }
      }

      if (facilityIds) {
        const [existingFacilities] = await require('../config/db').pool.query(
          'SELECT facility_id FROM hotel_facilities WHERE hotel_id = ?',
          [hotelId]
        );
        for (const existing of existingFacilities) {
          await Facility.removeFacilityFromHotel(hotelId, existing.facility_id);
        }
        for (const facilityId of facilityIds) {
          await Facility.addFacilityToHotel(hotelId, facilityId);
        }
      }

      if (tagIds) {
        const [existingTags] = await require('../config/db').pool.query(
          'SELECT tag_id FROM hotel_tags WHERE hotel_id = ?',
          [hotelId]
        );
        for (const existing of existingTags) {
          await Tag.removeTagFromHotel(hotelId, existing.tag_id);
        }
        for (const tagId of tagIds) {
          await Tag.addTagToHotel(hotelId, tagId);
        }
      }

      const updatedHotel = await Hotel.findById(hotelId);
      res.success({
        id: updatedHotel.id,
        status: updatedHotel.status,
        updatedAt: updatedHotel.updated_at
      });
    } catch (error) {
      console.error('更新酒店信息失败:', error);
      res.error('更新酒店信息失败', 500);
    }
  }

  static async deleteHotel(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const merchantId = req.user.id;

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.error('酒店不存在', 404);
      }

      if (hotel.merchant_id !== merchantId) {
        return res.error('无权删除此酒店', 403);
      }

      await Hotel.delete(hotelId);
      res.success(null, '删除成功');
    } catch (error) {
      console.error('删除酒店失败:', error);
      res.error('删除酒店失败', 500);
    }
  }

  static async createRoom(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const merchantId = req.user.id;
      const { type, area, bedType, maxOccupancy, price, totalRooms, images, amenities } = req.body;

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.error('酒店不存在', 404);
      }

      if (hotel.merchant_id !== merchantId) {
        return res.error('无权为此酒店添加房型', 403);
      }

      if (!type || !maxOccupancy || !price || !totalRooms) {
        return res.error('房型、最大入住人数、价格和房间总数不能为空');
      }

      const roomId = await Room.create({
        hotel_id: hotelId,
        type,
        area,
        bed_type: bedType,
        max_occupancy: maxOccupancy,
        price,
        total_rooms: totalRooms,
        available_rooms: totalRooms,
        images: images || [],
        amenities: amenities || []
      });

      const room = await Room.findById(roomId);
      res.success({
        id: room.id,
        hotelId: room.hotel_id,
        type: room.type,
        area: room.area,
        bedType: room.bed_type,
        maxOccupancy: room.max_occupancy,
        price: room.price,
        totalRooms: room.total_rooms,
        available: room.available_rooms,
        images: room.images,
        amenities: room.amenities,
        createdAt: room.created_at,
        updatedAt: room.updated_at
      }, '创建成功', 201);
    } catch (error) {
      console.error('创建房型失败:', error);
      res.error('创建房型失败', 500);
    }
  }

  static async updateRoom(req, res) {
    try {
      const roomId = req.params.roomId;
      const merchantId = req.user.id;
      const { type, area, bedType, maxOccupancy, price, totalRooms, images, amenities } = req.body;

      const room = await Room.findById(roomId);
      if (!room) {
        return res.error('房型不存在', 404);
      }

      const hotel = await Hotel.findById(room.hotel_id);
      if (hotel.merchant_id !== merchantId) {
        return res.error('无权修改此房型', 403);
      }

      const updated = await Room.update(roomId, {
        type: type !== undefined ? type : room.type,
        area: area !== undefined ? area : room.area,
        bed_type: bedType !== undefined ? bedType : room.bed_type,
        max_occupancy: maxOccupancy !== undefined ? maxOccupancy : room.max_occupancy,
        price: price !== undefined ? price : room.price,
        total_rooms: totalRooms !== undefined ? totalRooms : room.total_rooms,
        available_rooms: room.available_rooms,
        images: images !== undefined ? images : room.images,
        amenities: amenities !== undefined ? amenities : room.amenities
      });

      if (updated) {
        const updatedRoom = await Room.findById(roomId);
        res.success({
          id: updatedRoom.id,
          hotelId: updatedRoom.hotel_id,
          type: updatedRoom.type,
          area: updatedRoom.area,
          bedType: updatedRoom.bed_type,
          maxOccupancy: updatedRoom.max_occupancy,
          price: updatedRoom.price,
          totalRooms: updatedRoom.total_rooms,
          available: updatedRoom.available_rooms,
          images: updatedRoom.images,
          amenities: updatedRoom.amenities,
          createdAt: updatedRoom.created_at,
          updatedAt: updatedRoom.updated_at
        });
      } else {
        res.error('更新失败');
      }
    } catch (error) {
      console.error('更新房型信息失败:', error);
      res.error('更新房型信息失败', 500);
    }
  }

  static async deleteRoom(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const roomId = req.params.roomId;
      const merchantId = req.user.id;

      const room = await Room.findById(roomId);
      if (!room) {
        return res.error('房型不存在', 404);
      }

      const hotel = await Hotel.findById(hotelId);
      if (hotel.merchant_id !== merchantId) {
        return res.error('无权删除此房型', 403);
      }

      await Room.delete(roomId);
      res.success(null, '删除成功', 204);
    } catch (error) {
      console.error('删除房型失败:', error);
      res.error('删除房型失败', 500);
    }
  }

  static async getHotelRooms(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const merchantId = req.user.id;
      const { page, pageSize } = req.query;

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.error('酒店不存在', 404);
      }

      if (hotel.merchant_id !== merchantId) {
        return res.error('无权查看此酒店的房型', 403);
      }

      const rooms = await Room.findByHotelId(hotelId);
      const currentPage = parseInt(page) || 1;
      const currentPageSize = Math.min(parseInt(pageSize) || 20, 50);

      res.success({
        total: rooms.length,
        page: currentPage,
        pageSize: currentPageSize,
        items: rooms
      });
    } catch (error) {
      console.error('获取房型列表失败:', error);
      res.error('获取房型列表失败', 500);
    }
  }
}

module.exports = MerchantController;