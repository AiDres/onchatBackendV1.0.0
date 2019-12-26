const pool = require('../utils/pool.js');
const express = require('express');
var router = express.Router();
var U = require('../utils/util');


// 获取动态
router.post('/article',(req,res)=>{
	let session = req.session.security;
	let logId = null;
	U.outputLog({path:'/article',req:req.body},res=>logId=res);
	U.getUserid(req.body,session,(uid)=>{

		if(uid!=-1){
			let sql = 'SELECT userid,newsid,title,newslike,themeimage,newstime,content,spectator FROM ownNews WHERE userid=?';
			
			pool.query(sql,[uid],(err,result)=>{
				if(err)throw err;
				if(result.length){

					res.send({code:305,msg:'获取成功',data:result});
				}else{
					res.send({code:403,msg:'success null',logid:logId});
				}
				
			})
		}else{
			res.send({code:404,msg:'未登录'});
		}
	});
	
});

module.exports=router
	
