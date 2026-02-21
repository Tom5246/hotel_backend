const { pool } = require('../config/db');

class User {
  static async create(userData) {
    const { username, password, email, phone, role } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email, phone, role) VALUES (?, ?, ?, ?, ?)',
      [username, password, email, phone, role || 'user']
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findByPhone(phone) {
    const [rows] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    return rows[0];
  }

  static async update(id, userData) {
    const { username, password, email, phone, role } = userData;
    const [result] = await pool.query(
      'UPDATE users SET username = ?, password = ?, email = ?, phone = ?, role = ? WHERE id = ?',
      [username, password, email, phone, role, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }

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
}

module.exports = User;