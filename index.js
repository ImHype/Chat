require("./socket.js");

var express = require("express");
var app = express();
var session = require('express-session');
var cookie = require('cookie-parser');
var bodyParser = require('body-parser');

app.engine('html',require('ejs').renderFile);
app.set('port',3000);
app.use(session({
	secret:'chat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
	console.log(req.session);
	if(req.session.user != null){
		res.render('index.ejs');
	}else{
		res.render('main.ejs');
	}
});
app.get('/login',function(req,res){
	res.render("login.ejs");
});
app.get('/regist',function(req,res){
	res.render('regist.ejs')
});
app.post('/regist',function(req,res){
	res.send("通过");
	req.session.user={
		"name":req.body.name
	}
	console.log(req.session.user.name)
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