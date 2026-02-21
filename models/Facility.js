const { pool } = require('../config/db');

class Facility {
  static async create(facilityData) {
    const { name, icon } = facilityData;
    const [result] = await pool.query(
      'INSERT INTO facilities (name, icon) VALUES (?, ?)',
      [name, icon]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM facilities WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM facilities WHERE 1=1';
    const params = [];

    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async update(id, facilityData) {
    const { name, icon } = facilityData;
    const [result] = await pool.query(
      'UPDATE facilities SET name = ?, icon = ? WHERE id = ?',
      [name, icon, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM facilities WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getHotelFacilities(hotelId) {
    const [rows] = await pool.query(
      `SELECT f.* FROM facilities f
       INNER JOIN hotel_facilities hf ON f.id = hf.facility_id
       WHERE hf.hotel_id = ?`,
      [hotelId]
    );
    return rows;
  }

  static async addFacilityToHotel(hotelId, facilityId) {
    const [result] = await pool.query(
      'INSERT INTO hotel_facilities (hotel_id, facility_id) VALUES (?, ?)',
      [hotelId, facilityId]
    );
    return result.insertId;
  }

  static async removeFacilityFromHotel(hotelId, facilityId) {
    const [result] = await pool.query(
      'DELETE FROM hotel_facilities WHERE hotel_id = ? AND facility_id = ?',
      [hotelId, facilityId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Facility;