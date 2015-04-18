function socket (user) {

  var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8080 });
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send(data);
    });
  };

  wss.on('connection', function connection(ws) {
    
    ws.send("欢迎&nbsp;&nbsp;"+user.username);
    ws.on('message', function incoming(message) {
      wss.broadcast(user.username+":"+message+"<br/>");
    });
  });
}
module.exports = socket;