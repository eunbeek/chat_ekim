// websocket-server.js
const WebSocket = require('ws');

// run with 8080 port for websocket
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

// hanlde client connect
wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('New client connected');

  // message from client
  ws.on('message', (message) => {
    try {
      // parse message to json 
      const parsedMessage = JSON.parse(message);
      console.log(`Received message from ${parsedMessage.name}: ${parsedMessage.message}`);

      if (parsedMessage.action === 'delete') {
        const messageId = parsedMessage.messageId;
      
        // send deleted message id to all clients
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'delete', messageId }));
          }
        });
      } else {
        // send message to all clients
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
      
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  });

  // handle for client disconnection
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected');
  });
});


console.log('WebSocket server is running on ws://localhost:8080');
