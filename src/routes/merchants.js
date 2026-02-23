const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');

// POST /api/merchants/register - 商家注册
router.post('/register', merchantController.register);

// POST /api/merchants/login - 商家登录
router.post('/login', merchantController.login);

module.exports = router;
