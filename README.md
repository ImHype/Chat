# HTML5 Websocket接口实现的聊天室


> 团队协作的一个在线交流

--------------------------------
## 2015年6月23日更新

网页服务器与socket服务器对应的解决方式（免二次登录），采用 一个token来调和两者关系 


1. 用户注册生成账户密码
2. 用户登录生成一个token（"chat"+当前时间戳+username）组合而成的一个base64编码，记录在Users的表内
3. 然后就是浏览器的websocket
	* onopen -- 一个ajax请求，获取到用户的一个token ，并存于内存中，并向服务器发送这个token值，浏览器去Users数据库内查询，并把值存入到onlineUsers表内
	* 之后每次的发送消息，以一个json的形式 
	{
		token:token,
		msg:msg
	}

4. 服务端每次接收到信息，从onlineUsers表内查询是否是在线的账户，否则用户名账号密码错误，若是在线用户，查询出用户名，用于消息反馈
5. 用户退出讨论系统的时候，服务器将用户从onlineUsers表内删除

## License

© Junyu Xu
