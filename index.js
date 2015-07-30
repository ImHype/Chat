var express = require("express");
var app = express();
var session = require('express-session');
var cookie = require('cookie-parser');
var bodyParser = require('body-parser');

var tokenConfig = require("./token");
var crypto = require("crypto");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat');
var Users = mongoose.model('user', { username: String ,password: String ,token:String});
var onlineUsers = mongoose.model('onlineUsers',{ username:String ,token:String});

/***********************socket部分**************************/
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });
wss.broadcast = function broadcast(data) {

  wss.clients.forEach(function each(client) {

    client.send(data);
  });
};
wss.on("close",function(ws){
	console.log(ws);
});
wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {

    if(ws.user == null){
    	var tokenJson = JSON.parse(message);
    	console.log(tokenJson);
    	Users.findOne({"token":tokenJson.token},function(err,data){
    		if(data !=null ){
    			onlineUsers.findOne({"token":tokenJson.currentToken},function(error,e){
    				if(!e){
    					var onlineUser = new onlineUsers({
		    				username:data.username,
		    				token:tokenJson.currentToken
		    			});
		    			onlineUser.save(function(err){
		    				if(!err){
		    					ws.user = data.username;
					            ws.send("<h2>"+ws.user+"</h2> 进入<hr>");			
		    				}
		    			});
    				}else{
    					onlineUsers.update({"username":data.username},{
			    			$set:{
			    				username:data.username,
			    				token:tokenJson.currentToken
			    			}
			    		},{insert:true},function(err){
			    			if(!err){
			    				ws.user = data.username;
					            ws.send("<h2>"+ws.user+"</h2> 进入<hr>");			
			    			}
			    		});		
    				}
    			});
	        }else{
	          ws.send("请登录");
	        }
    	})
    }else{
    	var messageJson = JSON.parse(message);
    	onlineUsers.findOne({"token":messageJson.token},function(err,data){
    		if(data){
		      wss.broadcast("<span class='username'>"+data.username+"</span>:<span class='txt'>"+messageJson.txt+"</span><br/>");
    		}
    	});
    }
  });
});


app.engine('html',require('ejs').renderFile);

app.set('port',4000);

app.use(session({

  secret: "chat",

  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}//30 days

}));

app.use(cookie());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

/***********************路由部分**************************/

app.get('/',function(req,res){
	if(req.session.user != null){
		res.render('index.ejs');
	}else{
		res.render('main.ejs');
	}
});
app.get('/login',function(req,res){
	res.render("login.ejs");
});


app.post('/login',function(req,res){
	var username = req.body.username,
		password = req.body.password
	Users.findOne({username:username,password:password},function(err,data){
		if(data !=null ){

			req.session.user={
				"username":username,
				"password":password
			};
			res.render("message.ejs",{
				"message":"登录成功",
				"go":{
					"url":"/",
					"font":"点此跳转"
				}
			});	
		}else{
			res.render("message.ejs",{
				"message":"密码错误",
				"go":{
					"url":"..",
					"font":"点此跳转"
				}
			});
		}
	});
})
app.get('/regist',function(req,res){
	res.render('regist.ejs');
});
app.get('/token',function(req,res){
	var username = req.session.user.username;
	var token = crypto.createHash("md5").update(tokenConfig+new Date().getTime()+username).digest("hex");
	Users.findOne({username:username},function(err,data){
		if(data){
			res.send({
				token:data.token,
				currentToken:token
			});
		}
	});
})
app.post('/regist',function(req,res){
	var username =req.body.username;
	var token = crypto.createHash("md5").update(tokenConfig+username).digest("hex");

	if(req.body.username.length<5){
		res.send("用户名太短");
	}else if(req.body.username.length>15){
		res.send("用户名太长");
	}else if(req.body.password.length<5){
		res.send("密码太短");
	}else if(req.body.password.length>15){
		res.send("密码太长");
	}else{
		Users.find({username:req.body.username},function(err,data){
			if(data.length != 0){
				res.render("message.ejs",{
					"message":"用户名已存在",
					"go":{
						"url":"..",
						"font":"点此跳转"
					}
				});
				return;
			}else{
				var username = req.body.username,
					password = req.body.password;
				var user = new Users({
					"username": username,
					"password": password,
					"token":token
				});
				user.save(function (err) {
					if(!err){
						req.session.user={
							"username": username,
							"password": password
						};
						res.render("message.ejs",{
							"message":"登录成功",
							"go":{
								"url":"/",
								"font":"点此跳转"
							}
						});	
					}
				});
			}
		});
	}
	
})

app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.send("404 - Not Found !!!");
});
app.use(function(err, req, res, next){ 
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error !!!');
});
app.listen(app.get('port'), function(){
     console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});