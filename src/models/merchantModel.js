const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 注册商家
async function createMerchant({ name, email, phone, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    'INSERT INTO merchants (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
    [name, email, phone, hashedPassword]
  );
  return result.insertId;
}

// 根据邮箱查找商家
async function findMerchantByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM merchants WHERE email = ?', [email]);
  return rows[0];
}

// 根据 ID 查找商家
async function findMerchantById(id) {
  const [rows] = await pool.execute('SELECT id, name, email, phone FROM merchants WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { createMerchant, findMerchantByEmail, findMerchantById };
