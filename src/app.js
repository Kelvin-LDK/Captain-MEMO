require('dotenv').config();
const express = require('express');
const http = require('http');
const { initWebSocketServer } = require('./utils/websocket');

const app = express();
const server = http.createServer(app);

// 初始化 WebSocket 服务器（传入 server 实例）
initWebSocketServer(server);

// 静态文件服务
app.use(express.static('public'));

// 中间件：解析 JSON 请求体
app.use(express.json());

// 路由
const activitiesRouter = require('./routes/activities');
const merchantsRouter = require('./routes/merchants');
app.use('/api/activities', activitiesRouter);
app.use('/api/merchants', merchantsRouter);

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
