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

let token = 'md5-'+ new Date().getTime();
console.log(md5(token));
app.use(function (req, res, next) {
	let resLogin = req.session.security;
	if (!resLogin) {
	  req.session.security = {}
	}
	next()
})

app.post('/onchat/login',(req,res)=>{
	let email = req.body.email;
	let upwd = req.body.pwd;
	if(!email){res.send({code:-1,msg:'邮箱不能为空'});return;};
	if(!upwd){res.send({code:-2,msg:'密码不能为空'});return;};

	// 查询是否存在用户
	let sql = 'SELECT userid,uname,uAvatar,email,sex,fllowers,friends,tips,news,registerDate FROM users WHERE email=? AND upwd=md5(?)';
	pool.query(sql,[email,upwd],(err,result)=>{	
		if(err) throw err;

		// 找到用户
		if(result.length){
			// 生成token
			let tokencode = 'md5-'+result[0].registerDate+Math.floor(Math.random() * Math.floor(new Date().getTime()));
			req.session.security['tokenCode']=tokencode;

			// 更新保存token至数据库
			let sql = 'UPDATA users SET securitycode=? WHERE userid=?';
			pool.query(sql,[tokencode,result[0].userid],(err,setResult)=>{
				if(err) throw err;
				if(result.affectedRows>0){

					// 数据保存成功并将之前查询到的用户数据返回给客户端
					res.send({code:200,data:result});
				}else{
					res.send({code:301,logid:tokencode,msg:'服务器异常，请将logid提供给管理员'})
				}
			});
			
		}else{
			res.send({code:301,msg:"邮箱或密码不匹配"});
		}
	});
});

// 判断是否是登录状态
app.post('/onchat/hasLogin',(req,res)=>{
	let session = req.session.security;
	if(session && session.tokenCode && req.body.tokencode === session.tokenCode){
		let sql = 'SELECT userid,uname,uAvatar,email,sex,fllowers,friends,tips,news FROM users WHERE securitycode=?';
		pool.query(sql,[session.tokenCode],(err,result)=>{
			if(err) throw err;
			if(result.length){
				res.send({code:305,msg:'已登录',data:result});
			}else{
				res.send({code:403,msg:'服务器异常，请将logid提供给管理员',logid:session.tokenCode});
			}
			
		})
	}else{
		res.send({code:404,msg:'未登录'});
	}
	
});

function getUserid(params,session){
	let uid = -1;
	if(session && session.tokenCode && params.tokencode === session.tokenCode){
		let sql = 'SELECT userid FROM users WHERE securitycode=?';
		pool.query(sql,[params.tokencode],(err,result)=>{
			if(err) throw err;
			if(result.length){uid = result[0].userid;}
		})
	}
	return uid;
}

// 获取动态
app.post('/onchat/article',(req,res)=>{
	let session = req.session.security;
	let uid = getUserid(req.body,session);
	if(uid!=-1){
		let userInfo = {};
		let sql = 'SELECT userid,newsid,title,newslike,themeimage,newstime,content,spectator FROM ownnews WHERE userid=?';
		pool.query(sql,[uid],(err,result)=>{
			if(err) throw err;
			
			if(result.length){
				console.log(result)
				res.send({code:305,msg:'获取成功',data:result});
			}else{
				res.send({code:403,msg:'服务器异常',logid:session.tokenCode});
			}
			
		})
	}else{
		res.send({code:404,msg:'未登录'});
	}
})
