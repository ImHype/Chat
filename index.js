var socket = require("./socket.js");
var express = require("express");
var app = express();
var session = require('express-session');
var cookie = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat');
var Users = mongoose.model('user', { username: String ,password: String });


app.engine('html',require('ejs').renderFile);
app.set('port',3000);
app.use(session({
  secret: "chat",
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
	if(req.session.user != null){
		console.log(req.session.user)
		socket(req.session.user);
		res.render('index.ejs');
	}else{
		res.render('main.ejs');
	}
});
app.get('/login',function(req,res){
	res.render("login.ejs");
});
app.post('/login',function(req,res){
	Users.findOne({username:req.body.username,password:req.body.password},function(err,data){
		if(data !=null ){
			req.session.user={
				"username":req.body.username,
				"password":req.body.password
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
app.post('/regist',function(req,res){
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
				var kitty = new Users({
					"username":req.body.username,
					"password":req.body.password
				});
				kitty.save(function (err) {
					if(!err){
						req.session.user={
							"username":req.body.username,
							"password":req.body.password
						};
						res.render("message.ejs",{
							"message":"注册成功",
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
	res.send("404");
});
app.use(function(err, req, res, next){ 
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
     console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});