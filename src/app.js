require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 静态文件服务
app.use(express.static('public'));

// 路由
const activitiesRouter = require('./routes/activities');
app.use('/api/activities', activitiesRouter);

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// WebSocket 连接处理
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log('received:', message);
  });
  ws.send('Welcome to Captain MEMO!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
