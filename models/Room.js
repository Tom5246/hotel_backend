const { pool } = require('../config/db');

class Room {
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

  static async create(roomData) {
    const { hotel_id, type, area, bed_type, max_occupancy, price, total_rooms, available_rooms, images, amenities } = roomData;
    const [result] = await pool.query(
      'INSERT INTO rooms (hotel_id, type, area, bed_type, max_occupancy, price, total_rooms, available_rooms, images, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [hotel_id, type, area, bed_type, max_occupancy, price, total_rooms, available_rooms || total_rooms, JSON.stringify(images || []), JSON.stringify(amenities || [])]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
    if (rows[0]) {
      rows[0].images = Room.safeParseJSON(rows[0].images);
      rows[0].amenities = Room.safeParseJSON(rows[0].amenities);
    }
    return rows[0];
  }

  static async findByHotelId(hotelId) {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE hotel_id = ?', [hotelId]);
    return rows.map(room => ({
      ...room,
      images: Room.safeParseJSON(room.images),
      amenities: Room.safeParseJSON(room.amenities)
    }));
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM rooms WHERE 1=1';
    const params = [];

    if (filters.hotel_id) {
      query += ' AND hotel_id = ?';
      params.push(filters.hotel_id);
    }

    if (filters.type) {
      query += ' AND type LIKE ?';
      params.push(`%${filters.type}%`);
    }

    if (filters.min_price) {
      query += ' AND price >= ?';
      params.push(filters.min_price);
    }

    if (filters.max_price) {
      query += ' AND price <= ?';
      params.push(filters.max_price);
    }

    if (filters.max_occupancy) {
      query += ' AND max_occupancy >= ?';
      params.push(filters.max_occupancy);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows.map(room => ({
      ...room,
      images: Room.safeParseJSON(room.images),
      amenities: Room.safeParseJSON(room.amenities)
    }));
  }

  static async update(id, roomData) {
    const { type, area, bed_type, max_occupancy, price, total_rooms, available_rooms, images, amenities } = roomData;
    const [result] = await pool.query(
      'UPDATE rooms SET type = ?, area = ?, bed_type = ?, max_occupancy = ?, price = ?, total_rooms = ?, available_rooms = ?, images = ?, amenities = ? WHERE id = ?',
      [type, area, bed_type, max_occupancy, price, total_rooms, available_rooms, JSON.stringify(images || []), JSON.stringify(amenities || []), id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async updateAvailability(id, availableRooms) {
    const [result] = await pool.query(
      'UPDATE rooms SET available_rooms = ? WHERE id = ?',
      [availableRooms, id]
    );
    return result.affectedRows > 0;
  }

  static async getAvailableRooms(hotelId, checkInDate, checkOutDate, guestCount) {
    const [rows] = await pool.query(
      `SELECT r.* FROM rooms r
       WHERE r.hotel_id = ?
       AND r.max_occupancy >= ?
       AND r.available_rooms > 0
       AND r.id NOT IN (
         SELECT DISTINCT room_id FROM reservations
         WHERE hotel_id = ?
         AND status IN ('confirmed')
         AND (
           (check_in_date <= ? AND check_out_date > ?)
           OR (check_in_date < ? AND check_out_date >= ?)
         )
       )
       ORDER BY r.price ASC`,
      [hotelId, guestCount, hotelId, checkInDate, checkInDate, checkOutDate, checkOutDate]
    );
    return rows.map(room => ({
      ...room,
      images: Room.safeParseJSON(room.images),
      amenities: Room.safeParseJSON(room.amenities)
    }));
  }
}

module.exports = Room;