const pool = require('./pool.js');
const md5 = require('md5');
const fs = require('fs');

function getUserid(params,session,success){
	let uid = -1;
	if(session && session.length && session.indexOf(params.tokencode)!=-1){
		let sql = "SELECT userid FROM users WHERE securitycode=?";

		pool.query(sql,[params.tokencode],(err,result)=>{
			if(err) throw err;
			if(result.length){
				uid = result[0].userid;
				success(uid);
			}else{
				success(uid);
			}
		})
	}else{
		success(uid);
	}
}

function outputLog(data,dosuccess){
	let logId = getLogId();
	data['logId'] = logId;
	dosuccess && dosuccess(logId);
	fs.appendFile('./logs.log',`${JSON.stringify(data)}\n`,(err,result)=>{
		if(err) throw err;
	})
}

function getLogId(){
	let strSecu = new Date().getTime();
    strSecu = md5(strSecu);
	return strSecu;
}
function addmessages(data){
	return new Promise((resolve,reject)=>{
		let token = data.tokencode;
	let sqlOfUserId = 'SELECT userid FROM users WHERE securitycode=?';
	pool.query(sqlOfUserId,[token],(err,result1)=>{
		if(err) throw err;
		let uid = result1[0].userid;
		let sqlOfCount = ' SELECT count(*) as count FROM messages WHERE userId=? AND frindId=?;';
		let count = 0;
		pool.query(sqlOfCount,[uid,data.friendId],(err,result2)=>{
			if(err) throw err;
			count = result2[0].count;
			let sqlOfAdd = 'INSERT INTO messages VALUES(null,?,?,?,now(),?);';
			pool.query(sqlOfAdd,[uid,data.friendId,count+1,data.msg],(err,result3)=>{
				if(err) throw err;
				console.log('这里',result3);
				let sqlOfMsg = "SELECT orderId,userId,frindId,countId,createTime,msgInfo FROM messages WHERE userId=? AND frindId=? AND countId=?;";
				pool.query(sqlOfMsg,[uid,data.friendId,count+1],(err,result4)=>{
					if(err) throw err;
					resolve(result4[0]);
				})
			})
		})
		
	})
	})
}

function friendToken(uid){
	let sql = 'SELECT securitycode FROM users WHERE userid=?';
	pool.query(sql,[uid],(err,res)=>{
		if(err) throw err;
		return res[0].securitycode;
	})
}
module.exports={
	getUserid,
	getLogId,
	outputLog,
	friendToken,
	addmessages
}
