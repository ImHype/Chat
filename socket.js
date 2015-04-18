var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });
var Users = mongoose.model('user', { username: String ,password: String });

wss.broadcast = function broadcast(data) {

  wss.clients.forEach(function each(client) {

    client.send(data);
  });
};

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {

    var mes =JSON.parse(message);

    if(ws.user == null){

      Users.findOne({username:mes.username,password:mes.password},function(err,data){
      
        if(data !=null ){
      
          ws.user = mes.username;

          ws.psw = mes.password;

          ws.send("你好"+ws.user);
        
        }else{

          ws.send("密码不正确")
          ws.close();          
        }
      });
      
    }else{

      wss.broadcast(ws.user+":"+mes.txt+"<br/>");
    }
  });
});