var ws = new WebSocket("ws://127.0.0.1:8080/");
var doc = document;
var btn = doc.getElementById('send');
var text = doc.getElementsByTagName('input')[0];
var broad = doc.getElementById('broad');
btn.onclick=function(){
	ws.send(text.value);
}
ws.onopen = function() {
};    
     
ws.onmessage = function (evt) {
    broad.innerHTML+= (evt.data)+"<br>";
};    
     
ws.onclose = function() {
};    
     
ws.onerror = function(err) {
};