var cookie = {
	set:function(key,val,time){//设置cookie方法
		var date=new Date(); //获取当前时间
		var expiresDays=time;  //将date设置为n天以后的时间
		date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
		document.cookie=key + "=" + val +";expires="+date.toGMTString();  //设置cookie
	},
	get:function(key){//获取cookie方法
		/*获取cookie参数*/
		var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
		var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
		var tips;  //声明变量tips
		for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
			var arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
			if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
				tips=arr[1];   //将cookie的值赋给变量tips
				break;   //终止for循环遍历
			} 
		}
		return tips;
	}
}

var ws = new WebSocket("ws://127.0.0.1:8080/");
var doc = document;
var btn = doc.getElementById('send');
var text = doc.getElementsByTagName('input')[0];
var broad = doc.getElementById('broad');
var oUser = cookie.get("user");
var oPsw = cookie.get("psw");
var a = 0;

btn.onclick=function(){
	ws.send(JSON.stringify({
		username:oUser,
		txt:text.value
	}));
}
ws.onopen = function() {
	// if(a==0){
	// 	a=1;
	// 	ws.send(JSON.stringify({
	// 		username:"oUser",
	// 		password:"oPsw"
	// 	}));
	// }else{
		ws.send(JSON.stringify({
			username:oUser,
			password:oPsw
		}));
		// cookie.set("user","");
		// cookie.set("psw","");
	// }
	
}; 
     
ws.onmessage = function (evt) {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
    broad.innerHTML+= year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second+"<br>"+(evt.data)+"<br>";
};    
     
ws.onclose = function() {
};    
     
ws.onerror = function(err) {
};