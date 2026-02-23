const activityModel = require('../models/activityModel');
const { broadcast } = require('../utils/websocket'); // 从独立模块导入

async function getActivities(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || 'reveal_time';

    const result = await activityModel.getActivities(page, limit, sort);
    
    res.json({
      code: 200,
      data: result
    });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
}

async function createActivity(req, res) {
  const { title, description, location, start_time, end_time, reveal_time } = req.body;
  const merchant_id = req.merchant.id;

  if (!title) {
    return res.status(400).json({ code: 400, message: 'Title is required' });
  }

  try {
    const id = await activityModel.createActivity({
      merchant_id,
      title,
      description,
      location,
      start_time,
      end_time,
      reveal_time,
      status: 1
    });

    // 广播新活动信息
    broadcast({
      type: 'NEW_ACTIVITY',
      data: {
        id,
        title,
        merchant_name: req.merchant.name,
        location,
        start_time
      }
    });

    res.status(201).json({ code: 201, message: 'Activity created', data: { id } });
  } catch (err) {
    console.error('Create activity error:', err);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
}

module.exports = { getActivities, createActivity };
