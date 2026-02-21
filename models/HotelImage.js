const { pool } = require('../config/db');

class HotelImage {
  static async create(imageData) {
    const { hotel_id, url, type, sort_order } = imageData;
    const [result] = await pool.query(
      'INSERT INTO hotel_images (hotel_id, url, type, sort_order) VALUES (?, ?, ?, ?)',
      [hotel_id, url, type || 'other', sort_order || 0]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM hotel_images WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByHotelId(hotelId, filters = {}) {
    let query = 'SELECT * FROM hotel_images WHERE hotel_id = ?';
    const params = [hotelId];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }

    query += ' ORDER BY sort_order ASC, created_at ASC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async update(id, imageData) {
    const { url, type, sort_order } = imageData;
    const [result] = await pool.query(
      'UPDATE hotel_images SET url = ?, type = ?, sort_order = ? WHERE id = ?',
      [url, type, sort_order, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM hotel_images WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async deleteByHotelId(hotelId) {
    const [result] = await pool.query('DELETE FROM hotel_images WHERE hotel_id = ?', [hotelId]);
    return result.affectedRows > 0;
  }
}

module.exports = HotelImage;