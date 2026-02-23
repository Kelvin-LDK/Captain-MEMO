const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const merchantModel = require('../models/merchantModel');
require('dotenv').config();

// 注册
async function register(req, res) {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ code: 400, message: 'Name, email and password are required' });
  }

  try {
    // 检查邮箱是否已存在
    const existing = await merchantModel.findMerchantByEmail(email);
    if (existing) {
      return res.status(409).json({ code: 409, message: 'Email already registered' });
    }

    const id = await merchantModel.createMerchant({ name, email, phone, password });
    res.status(201).json({ code: 201, message: 'Merchant created', data: { id } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
}

// 登录
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ code: 400, message: 'Email and password are required' });
  }

  try {
    const merchant = await merchantModel.findMerchantByEmail(email);
    if (!merchant) {
      return res.status(401).json({ code: 401, message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, merchant.password_hash);
    if (!valid) {
      return res.status(401).json({ code: 401, message: 'Invalid email or password' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: merchant.id, email: merchant.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      code: 200,
      message: 'Login successful',
      data: {
        token,
        merchant: { id: merchant.id, name: merchant.name, email: merchant.email, phone: merchant.phone }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
}

module.exports = { register, login };
