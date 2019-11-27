const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const userRouter = require('./routers/userRouter');
const socialMatteRouter = require('./routers/sociMatterRouter');


var app = express();
app.listen(3000,()=>{
	console.log('listen a port 3000')
});
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
	let resLogin = req.session.security;
	if (!resLogin) {
	  req.session.security = {}
	}
	next()
})
app.use('/user',userRouter);
app.use('/socialMatter',socialMatteRouter);

// du42DU!