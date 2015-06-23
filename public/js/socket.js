var doc = document;
var btn = doc.getElementById('send');
var text = doc.getElementsByTagName('input')[0];
var broad = doc.getElementById('broad');
function afterAjax(token){
var ws = new WebSocket("ws://127.0.0.1:8080/");
btn.onclick=function(){
	ws.send(JSON.stringify({
		token:token.currentToken,
		txt:text.value
	}));
}
ws.onopen = function() {
	ws.send(JSON.stringify(token));
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
	ws.send(token.currentToken)
};
     
ws.onerror = function(err) {
	ws.send(token.currentToken)
};
}
$.ajax({
	method:"GET",
	url:"/token"
}).success(function(data){
	afterAjax(data);
});