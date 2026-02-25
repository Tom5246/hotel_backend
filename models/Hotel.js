const { pool } = require('../config/db');

class Hotel {
  static safeParseJSON(jsonString) {
    try {
      if (!jsonString) {
        return [];
      }
      
      if (Array.isArray(jsonString)) {
        return jsonString;
      }
      
      if (typeof jsonString !== 'string') {
        return [];
      }
      
      if (jsonString === 'null' || jsonString.trim() === '') {
        return [];
      }
      
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      
      return [];
    } catch (error) {
      console.error('JSON解析失败:', error.message, '原始数据:', jsonString);
      return [];
    }
  }
  static async create(hotelData) {
    const { merchant_id, name, address, description, star, rating, opening_date, status, audit_comment } = hotelData;
    const [result] = await pool.query(
      'INSERT INTO hotels (merchant_id, name, address, description, star, rating, opening_date, status, audit_comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [merchant_id, name, address, description, star, rating || 0.0, opening_date, status || 'pending', audit_comment]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM hotels WHERE id = ? AND is_deleted = 0', [id]);
    return rows[0];
  }

  static async findByMerchantId(merchantId, filters = {}) {
    let query = 'SELECT * FROM hotels WHERE merchant_id = ? AND is_deleted = 0';
    const params = [merchantId];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.page && filters.pageSize) {
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 10;
      query += ' LIMIT ? OFFSET ?';
      params.push(pageSize, (page - 1) * pageSize);
    }
    // if (filters.offset) {
    //   query += ' OFFSET ?';
    //   params.push(filters.offset);
    // }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async search(filters = {}) {
    let query = `
      SELECT h.*, 
             (SELECT MIN(r.price) FROM rooms r WHERE r.hotel_id = h.id) as price,
             (SELECT url FROM hotel_images hi WHERE hi.hotel_id = h.id AND hi.type = 'main' LIMIT 1) as image
      FROM hotels h 
      WHERE h.status = 'published' AND h.is_deleted = 0
    `;
    const params = [];

    if (filters.city) {
      query += ' AND h.address LIKE ?';
      params.push(`%${filters.city}%`);
    }

    if (filters.keyword) {
      query += ' AND (h.name LIKE ? OR h.address LIKE ?)';
      params.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
    }

    if (filters.star) {
      const stars = filters.star.split(',').map(s => s.trim());
      query += ' AND h.star IN (' + stars.map(() => '?').join(',') + ')';
      params.push(...stars);
    }

    if (filters.priceMin) {
      query += ' AND (SELECT MIN(r.price) FROM rooms r WHERE r.hotel_id = h.id) >= ?';
      params.push(filters.priceMin);
    }

    if (filters.priceMax) {
      query += ' AND (SELECT MIN(r.price) FROM rooms r WHERE r.hotel_id = h.id) <= ?';
      params.push(filters.priceMax);
    }

    if (filters.tags) {
      const tagIds = filters.tags.split(',').map(t => t.trim());
      query += ' AND h.id IN (SELECT hotel_id FROM hotel_tags WHERE tag_id IN (' + tagIds.map(() => '?').join(',') + '))';
      params.push(...tagIds);
    }

    const sortField = filters.sort || 'newest';
    switch (sortField) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'rating_desc':
        query += ' ORDER BY h.rating DESC';
        break;
      case 'newest':
      default:
        query += ' ORDER BY h.created_at DESC';
        break;
    }

    const page = parseInt(filters.page) || 1;
    const pageSize = Math.min(parseInt(filters.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;

    query += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [rows] = await pool.query(query, params);
    
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM hotels h 
      WHERE h.status = 'published'
      ${filters.city ? 'AND h.address LIKE ?' : ''}
      ${filters.keyword ? 'AND (h.name LIKE ? OR h.address LIKE ?)' : ''}
      ${filters.star ? 'AND h.star IN (' + filters.star.split(',').map(() => '?').join(',') + ')' : ''}
      ${filters.priceMin ? 'AND (SELECT MIN(r.price) FROM rooms r WHERE r.hotel_id = h.id) >= ?' : ''}
      ${filters.priceMax ? 'AND (SELECT MIN(r.price) FROM rooms r WHERE r.hotel_id = h.id) <= ?' : ''}
      ${filters.tags ? 'AND h.id IN (SELECT hotel_id FROM hotel_tags WHERE tag_id IN (' + filters.tags.split(',').map(() => '?').join(',') + '))' : ''}
    `;
    const countParams = [];
    if (filters.city) countParams.push(`%${filters.city}%`);
    if (filters.keyword) countParams.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
    if (filters.star) countParams.push(...filters.star.split(',').map(s => s.trim()));
    if (filters.priceMin) countParams.push(filters.priceMin);
    if (filters.priceMax) countParams.push(filters.priceMax);
    if (filters.tags) countParams.push(...filters.tags.split(',').map(t => t.trim()));

    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;

    return { items: rows, total, page, pageSize };
  }

  static async getHotelWithDetails(hotelId, checkIn = null, checkOut = null) {
    let query = `
      SELECT h.*, 
             u.username as merchant_name,
             (SELECT COUNT(*) FROM rooms WHERE hotel_id = h.id) as room_count
      FROM hotels h
      LEFT JOIN users u ON h.merchant_id = u.id
      WHERE h.id = ? AND h.is_deleted = 0
    `;
    const params = [hotelId];

    const [rows] = await pool.query(query, params);
    if (!rows[0]) return null;

    const hotel = rows[0];

    const [images] = await pool.query('SELECT id, url, type FROM hotel_images WHERE hotel_id = ? ORDER BY sort_order ASC', [hotelId]);
    hotel.images = images;

    const [tags] = await pool.query(`
      SELECT t.id, t.name 
      FROM tags t
      INNER JOIN hotel_tags ht ON t.id = ht.tag_id
      WHERE ht.hotel_id = ?
    `, [hotelId]);
    hotel.tags = tags.map(t => t.name);

    let roomQuery = 'SELECT * FROM rooms WHERE hotel_id = ?';
    const roomParams = [hotelId];

    if (checkIn && checkOut) {
      roomQuery += ` AND id NOT IN (
        SELECT DISTINCT room_id FROM reservations
        WHERE hotel_id = ?
        AND status IN ('confirmed')
        AND (
          (check_in_date <= ? AND check_out_date > ?)
          OR (check_in_date < ? AND check_out_date >= ?)
        )
      )`;
      roomParams.push(hotelId, checkIn, checkIn, checkOut, checkOut);
    }

    const [rooms] = await pool.query(roomQuery, roomParams);
    hotel.rooms = rooms.map(room => ({
      id: room.id,
      type: room.type,
      area: room.area,
      bedType: room.bed_type,
      maxOccupancy: room.max_occupancy,
      price: room.price,
      totalRooms: room.total_rooms,
      available: room.available_rooms,
      images: Hotel.safeParseJSON(room.images || '[]'),
      amenities: Hotel.safeParseJSON(room.amenities || '[]')
    }));

    return hotel;
  }

  static async getPriceCalendar(hotelId, yearMonth) {
    const [rows] = await pool.query(`
      SELECT date, MIN(price) as lowestPrice, 
             CASE WHEN SUM(available) > 0 THEN true ELSE false END as available
      FROM (
        SELECT pc.date, pc.price, 
               CASE WHEN pc.status = 'available' THEN pc.available ELSE 0 END as available
        FROM price_calendar pc
        WHERE pc.hotel_id = ?
        ${yearMonth ? 'AND DATE_FORMAT(pc.date, "%Y-%m") = ?' : ''}
      ) as calendar
      GROUP BY date
      ORDER BY date
    `, yearMonth ? [hotelId, yearMonth] : [hotelId]);

    return {
      hotelId: parseInt(hotelId),
      yearMonth: yearMonth || new Date().toISOString().slice(0, 7),
      prices: rows
    };
  }

  static async update(id, hotelData) {
    const { name, address, description, star, rating, opening_date, status, audit_comment } = hotelData;
    const [result] = await pool.query(
      'UPDATE hotels SET name = ?, address = ?, description = ?, star = ?, rating = ?, opening_date = ?, status = ?, audit_comment = ? WHERE id = ?',
      [name, address, description, star, rating, opening_date, status, audit_comment, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('UPDATE hotels SET is_deleted = 1 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async updateStatus(id, status, auditComment = null) {
    const [result] = await pool.query(
      'UPDATE hotels SET status = ?, audit_comment = ? WHERE id = ?',
      [status, auditComment, id]
    );
    return result.affectedRows > 0;
  }

  static async getPendingHotels(filters = {}) {
    let query = `
      SELECT h.*, u.id as merchant_id, u.username as merchant_username
      FROM hotels h
      LEFT JOIN users u ON h.merchant_id = u.id
      WHERE h.status = 'pending'
    `;
    const params = [];

    const page = parseInt(filters.page) || 1;
    const pageSize = Math.min(parseInt(filters.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;

    query += ' ORDER BY h.created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [rows] = await pool.query(query, params);

    const [countRows] = await pool.query('SELECT COUNT(*) as total FROM hotels WHERE status = ?', ['pending']);
    const total = countRows[0].total;

    return { items: rows, total, page, pageSize };
  }

  static async getAllHotels(filters = {}) {
    let query = `
      SELECT h.*, 
             u.id as merchant_id, u.username as merchant_username, u.email as merchant_email, u.phone as merchant_phone,
             (SELECT MIN(price) FROM rooms WHERE hotel_id = h.id) as min_price,
             (SELECT MAX(price) FROM rooms WHERE hotel_id = h.id) as max_price,
             (SELECT url FROM hotel_images WHERE hotel_id = h.id AND type = 'main' LIMIT 1) as cover_image
      FROM hotels h
      LEFT JOIN users u ON h.merchant_id = u.id
      WHERE h.is_deleted = 0
    `;
    const params = [];
    // console.log(filters);
    if (filters.status) {
      query += ' AND h.status = ?';
      params.push(filters.status);
    }

    if (filters.merchantId) {
      query += ' AND h.merchant_id = ?';
      params.push(filters.merchantId);
    }

    query += ' ORDER BY h.created_at DESC';

    const page = parseInt(filters.page) || 1;
    const pageSize = Math.min(parseInt(filters.pageSize) || 10, 50);
    const offset = (page - 1) * pageSize;

    query += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [rows] = await pool.query(query, params);

    let countQuery = 'SELECT COUNT(*) as total FROM hotels h WHERE 1=1';
    const countParams = [];
    if (filters.status) {
      countQuery += ' AND h.status = ?';
      countParams.push(filters.status);
    }
    if (filters.merchantId) {
      countQuery += ' AND h.merchant_id = ?';
      countParams.push(filters.merchantId);
    }

    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;

    return { 
      items: rows.map(row => ({
        id: row.id,
        name: row.name,
        address: row.address,
        star: row.star,
        rating: row.rating,
        priceRange: { min: row.min_price, max: row.max_price },
        coverImage: row.cover_image,
        status: row.status,
        auditStatus: row.status,
        auditComment: row.audit_comment,
        merchant: {
          id: row.merchant_id,
          username: row.merchant_username,
          email: row.merchant_email,
          phone: row.merchant_phone
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      total, 
      page, 
      pageSize 
    };
  }
}

module.exports = Hotel;