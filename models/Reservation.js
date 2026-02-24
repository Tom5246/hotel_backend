const { pool } = require('../config/db');

class Reservation {
  static safeParseJSON(jsonString) {
    try {
      if (!jsonString) {
        return {};
      }
      
      if (typeof jsonString === 'object' && !Array.isArray(jsonString)) {
        return jsonString;
      }
      
      if (typeof jsonString !== 'string') {
        return {};
      }
      
      if (jsonString === 'null' || jsonString.trim() === '') {
        return {};
      }
      
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
      
      return {};
    } catch (error) {
      console.error('JSON解析失败:', error.message, '原始数据:', jsonString);
      return {};
    }
  }
  static async create(reservationData) {
    const { reservation_no, user_id, hotel_id, room_id, check_in_date, check_out_date, total_price, guest_info, contact_name, contact_phone, special_requests, promotion_id } = reservationData;
    const [result] = await pool.query(
      'INSERT INTO reservations (reservation_no, user_id, hotel_id, room_id, check_in_date, check_out_date, total_price, guest_info, contact_name, contact_phone, special_requests, promotion_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [reservation_no, user_id, hotel_id, room_id, check_in_date, check_out_date, total_price, JSON.stringify(guest_info), contact_name, contact_phone, special_requests, promotion_id]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (rows[0]) {
      rows[0].guest_info = Reservation.safeParseJSON(rows[0].guest_info);
    }
    return rows[0];
  }

  static async findByReservationNo(reservationNo) {
    const [rows] = await pool.query('SELECT * FROM reservations WHERE reservation_no = ?', [reservationNo]);
    if (rows[0]) {
      rows[0].guest_info = Reservation.safeParseJSON(rows[0].guest_info);
    }
    return rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    let query = `SELECT r.*, h.name as hotel_name, rm.type as room_type 
                 FROM reservations r
                 LEFT JOIN hotels h ON r.hotel_id = h.id
                 LEFT JOIN rooms rm ON r.room_id = rm.id
                 WHERE r.user_id = ?`;
    const params = [userId];

    if (filters.status) {
      query += ' AND r.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY r.created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows.map(reservation => ({
      ...reservation,
      guest_info: Reservation.safeParseJSON(reservation.guest_info)
    }));
  }

  static async findByHotelId(hotelId, filters = {}) {
    let query = 'SELECT * FROM reservations WHERE hotel_id = ?';
    const params = [hotelId];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows.map(reservation => ({
      ...reservation,
      guest_info: Reservation.safeParseJSON(reservation.guest_info)
    }));
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];

    if (filters.user_id) {
      query += ' AND user_id = ?';
      params.push(filters.user_id);
    }

    if (filters.hotel_id) {
      query += ' AND hotel_id = ?';
      params.push(filters.hotel_id);
    }

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.check_in_date_from) {
      query += ' AND check_in_date >= ?';
      params.push(filters.check_in_date_from);
    }

    if (filters.check_in_date_to) {
      query += ' AND check_in_date <= ?';
      params.push(filters.check_in_date_to);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows.map(reservation => ({
      ...reservation,
      guest_info: Reservation.safeParseJSON(reservation.guest_info)
    }));
  }

  static async update(id, reservationData) {
    const { status, special_requests } = reservationData;
    const [result] = await pool.query(
      'UPDATE reservations SET status = ?, special_requests = ? WHERE id = ?',
      [status, special_requests, id]
    );
    return result.affectedRows > 0;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.query(
      'UPDATE reservations SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM reservations WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async cancel(id) {
    const [result] = await pool.query(
      'UPDATE reservations SET status = ? WHERE id = ?',
      ['cancelled', id]
    );
    return result.affectedRows > 0;
  }

  static async getReservationWithDetails(reservationId) {
    const [rows] = await pool.query(
      `SELECT r.*, u.username as user_name, h.name as hotel_name, 
              rm.type as room_type, rm.price as room_price
       FROM reservations r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN hotels h ON r.hotel_id = h.id
       LEFT JOIN rooms rm ON r.room_id = rm.id
       WHERE r.id = ?`,
      [reservationId]
    );
    if (rows[0]) {
      rows[0].guest_info = Reservation.safeParseJSON(rows[0].guest_info);
    }
    return rows[0];
  }

  static async generateReservationNo() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `RES${dateStr}${randomStr}`;
  }
}

module.exports = Reservation;