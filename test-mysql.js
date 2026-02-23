require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('Connected to MySQL');
    const [rows] = await connection.execute('SELECT 1+1 AS result');
    console.log('MySQL test query result:', rows[0].result);
    await connection.end();
  } catch (err) {
    console.error('MySQL connection failed:', err);
  }
})();
