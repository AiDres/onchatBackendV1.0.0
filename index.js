const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const pool = require('./pool.js');
const md5 = require('md5');
var app = express();
app.listen(3000);
app.use(express.static('public'));

// 处理post请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:false
}));

// 配置session
app.use(session({
	path: '/', 
	resave: true,
	httpOnly: true, 
	secure: false, 
	saveUninitialized: true,
	secret: 'keyboard cat',
	cookie:{
		maxAge: 1000 * 60 * 60 * 24
	}
}));

// 加载跨域访问模块
// 配置跨域访问模块哪个域名跨域访问允许
app.use(cors({
  origin: true,
  credentials: true,
  maxAge: 3600
}))

app.use(function (req, res, next) {
	let resLogin = req.session.islogin;
	if (!resLogin) {
	  req.session.islogin = {}
	}
	next()
})

app.post('/onchat/login',(req,res)=>{
	let email = req.body.email;
	let upwd = req.body.pwd;
	if(!email){res.send({code:-1,msg:'邮箱不能为空'});return;};
	if(!upwd){res.send({code:-2,msg:'邮箱不能为空'});return;};
	let sql = 'SELECT userid,uname,uAvatar,email,sex,fllowers,friends,tips,news FROM users WHERE email=? AND upwd=md5(?)';
	pool.query(sql,[email,upwd],(err,result)=>{	
		if(err) throw err;
		if(result.length){
			req.session.islogin['state']="true";
			req.session.islogin['uid']=result[0].userid;
			res.send({code:200,data:result});
		}else{
			res.send({code:301,msg:"手机号或密码不匹配"});
		}
	});
});

// 判断是否是登录状态
app.post('/onchat/hasLogin',(req,res)=>{
	if(req.session.islogin && req.session.islogin.state){
		let userInfo = {};
		let sql = 'SELECT userid,uname,uAvatar,email,sex,fllowers,friends,tips,news FROM users WHERE userid=?';
		pool.query(sql,[req.session.islogin.uid],(err,result)=>{
			if(err) throw err;
			if(result.length){
				res.send({code:305,msg:'已登录',data:result});
			}else{
				res.send({code:403,msg:'服务器异常',data:{}});
			}
			
		})
	}else{
		res.send({code:404,msg:'未登录'});
	}
	
});


// 获取动态
app.post('/onchat/article',(req,res)=>{
	if(req.session.islogin && req.session.islogin.state){
		let userInfo = {};
		let sql = 'SELECT userid,newsid,title,newslike,themeimage,newstime,content,spectator FROM ownnews WHERE userid=?';
		console.log(req.session.islogin.uid,'article')
		pool.query(sql,[req.session.islogin.uid],(err,result)=>{
			if(err) throw err;
			
			if(result.length){
				console.log(result)
				res.send({code:305,msg:'获取成功',data:result});
			}else{
				res.send({code:403,msg:'服务器异常',data:{}});
			}
			
		})
	}else{
		res.send({code:404,msg:'未登录'});
	}
})
