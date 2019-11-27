const express = require('express');
const pool = require('../utils/pool.js');
const router = express.Router();
const U = require('../utils/util.js');

const md5 = require('md5');
router.post('/login',(req,res)=>{
	let email = req.body.email;
    let upwd = req.body.pwd;
	if(!email){res.send({code:-1,msg:'邮箱不能为空'});return;};
    if(!upwd){res.send({code:-2,msg:'密码不能为空'});return;};
    U.outputLog({path:'/login',req:req.body});
	// 查询是否存在用户
	let sql = 'SELECT userid,uname,uAvatar,email,sex,fllowers,friends,tips,news,registerDate FROM users WHERE email=? AND upwd=md5(?)';
	pool.query(sql,[email,upwd],(err,result)=>{	
		if(err) throw err;

		// 找到用户
		if(result.length){
			// 生成token
			let tokencode = md5('md5-'+result[0].registerDate+Math.floor(Math.random() * Math.floor(new Date().getTime())));
			req.session.security['tokenCode']=tokencode;

			// 更新保存token至数据库
			let sql = 'UPDATE users SET securitycode=? WHERE userid=?';
			pool.query(sql,[tokencode,result[0].userid],(err,setResult)=>{
				if(err) throw err;
				if(setResult.affectedRows>0){

					// 数据保存成功并将之前查询到的用户数据返回给客户端
					res.send({code:200,data:result,tokencode:tokencode});
				}else{
					res.send({code:301,logid:logId,msg:'服务器异常，请将logid提供给管理员'})
				}
			});
			
		}else{
			res.send({code:301,msg:"邮箱或密码不匹配"});
		}
	});
});

// 判断是否是登录状态
router.post('/hasLogin',(req,res)=>{
    let session = req.session.security;
    U.outputLog({path:'/hasLogin',req:req.body});
	if(session && session.tokenCode && req.body.tokencode === session.tokenCode){
        let sql = 'SELECT userid,uname,uAvatar,email,sex,fllowers,friends,tips,news FROM users WHERE securitycode=?';
		pool.query(sql,[session.tokenCode],(err,result)=>{
			if(err) throw err;
			if(result.length){
				res.send({code:305,msg:'已登录',data:result});
			}else{
                res.send({code:403,msg:'服务器异常，请将logid提供给管理员',logid:logId});
            }
			
		})
	}else{
		res.send({code:404,msg:'未登录'});
	}
});

module.exports = router;