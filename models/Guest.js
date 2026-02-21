const { pool } = require('../config/db');

class Guest {
  static async create(guestData) {
    const { user_id, first_name, last_name, id_type, id_number, phone } = guestData;
    const [result] = await pool.query(
      'INSERT INTO guests (user_id, first_name, last_name, id_type, id_number, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, first_name, last_name, id_type, id_number, phone]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM guests WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    let query = 'SELECT * FROM guests WHERE user_id = ?';
    const params = [userId];

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM guests WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async countByUserId(userId) {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM guests WHERE user_id = ?', [userId]);
    return rows[0].total;
  }
}

module.exports = Guest;