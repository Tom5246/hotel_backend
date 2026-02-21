const { pool } = require('../config/db');

class Tag {
  static async create(tagData) {
    const { name, category } = tagData;
    const [result] = await pool.query(
      'INSERT INTO tags (name, category) VALUES (?, ?)',
      [name, category]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM tags WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM tags WHERE 1=1';
    const params = [];

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async update(id, tagData) {
    const { name, category } = tagData;
    const [result] = await pool.query(
      'UPDATE tags SET name = ?, category = ? WHERE id = ?',
      [name, category, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM tags WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getHotelTags(hotelId) {
    const [rows] = await pool.query(
      `SELECT t.* FROM tags t
       INNER JOIN hotel_tags ht ON t.id = ht.tag_id
       WHERE ht.hotel_id = ?`,
      [hotelId]
    );
    return rows;
  }

  static async addTagToHotel(hotelId, tagId) {
    const [result] = await pool.query(
      'INSERT INTO hotel_tags (hotel_id, tag_id) VALUES (?, ?)',
      [hotelId, tagId]
    );
    return result.insertId;
  }

  static async removeTagFromHotel(hotelId, tagId) {
    const [result] = await pool.query(
      'DELETE FROM hotel_tags WHERE hotel_id = ? AND tag_id = ?',
      [hotelId, tagId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Tag;