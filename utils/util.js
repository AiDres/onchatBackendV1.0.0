const pool = require('./pool.js');
const md5 = require('md5');
const fs = require('fs');

function getUserid(params,session,success){
	let uid = -1;
	if(session && session.tokenCode && params.tokencode === session.tokenCode){
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
	
	
	}
}

function outputLog(data){
	let logId = getLogId();
	data['logId'] = logId;
	fs.appendFile('./logs.log',`${JSON.stringify(data)}\n`,(err,result)=>{
		if(err) throw err;
	})
}

function getLogId(){
	let strSecu = new Date().getTime();
    strSecu = md5(strSecu);
	return strSecu;
}
module.exports={
	getUserid,
	getLogId,
	outputLog
}