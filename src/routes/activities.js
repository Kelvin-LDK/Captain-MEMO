const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// GET /api/activities - 获取活动列表
router.get('/', activityController.getActivities);

module.exports = router;
