var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {

   if(!ws.e){
   	ws.e = message;
   	ws.send("欢迎您"+message);
   	return;
   }
  	wss.broadcast(ws.e+":"+message+"<br/>");
  });
});