const activityModel = require('../models/activityModel');

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

module.exports = { getActivities };
