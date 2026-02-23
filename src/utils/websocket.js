const WebSocket = require('ws');

// 存储所有连接的客户端
const clients = new Set();

// 初始化 WebSocket 服务器
function initWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);

    ws.on('message', (message) => {
      console.log('received:', message);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      clients.delete(ws);
    });

    ws.send('Welcome to Captain MEMO!');
  });

  return wss;
}

// 广播函数：向所有客户端发送消息
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

module.exports = { initWebSocketServer, broadcast };
