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
			if(JSON.stringify(req.session.security)!='{}'){
				let count = req.session.security;
				count.push(tokencode);
				req.session.security = count;
			}else{
				req.session.security = [tokencode];
			}
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
    let session = JSON.stringify(req.session.security)!="{}"?req.session.security:false;
    U.outputLog({path:'/hasLogin',req:req.body});
    let logId = null;
	U.outputLog({path:'/getMsgList',req:req.body},res=>logId=res);
	if(session && session.length && session.indexOf(req.body.tokencode)!=-1){
        let sql = 'SELECT userid,uname,uAvatar,email,sex,fllowers,friends,tips,news FROM users WHERE securitycode=?';
		pool.query(sql,[req.body.tokencode],(err,result)=>{
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

router.post('/getMsgList',(req,res)=>{
	let session = JSON.stringify(req.session.security)!="{}"?req.session.security:[];
	U.outputLog({path:'/getMsgList',req:req.body});
	let logId = null;
	U.outputLog({path:'/getMsgList',req:req.body},res=>logId=res);
	console.log(req.body,session)
	U.getUserid(req.body,session,(uid)=>{
		if(uid!=-1){
			// 1.根据用户id查找与id匹配的数据->2.取数据的好友id查用户表->3.获取关键信息->步骤1和3根据用户id进行合并->返回给前端
			let sql = "SELECT * FROM messages WHERE userId=?;";
			pool.query(sql,[uid],(err,result1)=>{
				if(err) throw err;
				if(result1.length){
					let msglistData = result1;
					let userIds = result1.map(p=>(p.frindId).toString());
					let userSql = `SELECT userid,uname,uAvatar,email,sex,fllowers,tips,news FROM users WHERE userid IN (${(userIds.map(p=>p.replace(p,'?'))).toString()})`;
					let resultList = [];
					pool.query(userSql,userIds,(err,result2)=>{
						if(err) throw err;
						result2.forEach(item1=>{
							let item = result1.filter(item2=>item2.frindId==item1.userid);
							delete item1.userid;
							item1['msgList'] = item;

						})
						res.send({code:200,msg:'获取成功',data:result2,logid:logId});
					})
				}else{
					res.send({code:302,msg:'暂无数据',logid:logId});
				}
			})
			// pool.query(sql,[uid],(err,result)=>{
			// 	if(err)throw err;
			// 	if(result.length){

			// 		res.send({code:305,msg:'获取成功',data:result});
			// 	}else{
			// 		res.send({code:403,msg:'success null',logid:logId});
			// 	}
				
			// });
		}else{
			res.send({code:301,msg:'用户不存在',logid:logId});
		}
	});
})

module.exports = router;