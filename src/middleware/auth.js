const jwt = require('jsonwebtoken');
const merchantModel = require('../models/merchantModel');
require('dotenv').config();

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const merchant = await merchantModel.findMerchantById(decoded.id);
    if (!merchant) {
      return res.status(401).json({ code: 401, message: 'Unauthorized' });
    }
    req.merchant = merchant;
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, message: 'Invalid token' });
  }
}

module.exports = { authenticate };
