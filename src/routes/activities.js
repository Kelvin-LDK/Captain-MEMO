const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticate } = require('../middleware/auth');

// GET /api/activities - 获取活动列表（公开）
router.get('/', activityController.getActivities);

// POST /api/activities - 发布活动（需要认证）
router.post('/', authenticate, activityController.createActivity);

module.exports = router;
