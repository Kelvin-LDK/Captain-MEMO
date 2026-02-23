const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 获取活动列表（支持分页和排序）
async function getActivities(page = 1, limit = 20, sort = 'reveal_time') {
  const offset = (page - 1) * limit;
  // 确保排序字段安全（防止 SQL 注入）
  const allowedSortFields = ['start_time', 'created_at', 'reveal_time'];
  const orderBy = allowedSortFields.includes(sort) ? sort : 'reveal_time';

  const [rows] = await pool.execute(
    `SELECT 
      a.id, a.title, a.description, a.location, 
      a.start_time, a.end_time, a.reveal_time, a.status, a.created_at,
      m.name as merchant_name
     FROM activities a
     JOIN merchants m ON a.merchant_id = m.id
     WHERE a.status = 1 AND a.reveal_time <= NOW()
     ORDER BY ${orderBy} DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  // 获取总数
  const [totalRows] = await pool.execute(
    `SELECT COUNT(*) as total FROM activities WHERE status = 1 AND reveal_time <= NOW()`
  );

  return {
    items: rows,
    total: totalRows[0].total,
    page: page,
    limit: limit
  };
}

module.exports = { getActivities };
