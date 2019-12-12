const express = require('express');
const pool = require('../utils/pool.js');
const router = express.Router();
const U = require('../utils/util.js');

const md5 = require('md5');

router.post('/getMsgList',(req,res)=>{
	U.outputLog({path:'/getMsgList',req:req.body});
})