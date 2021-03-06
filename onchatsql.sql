-- 配置解码方式
SET NAMES UTF8;

DROP DATABASE IF EXISTS store;

CREATE DATABASE store CHARSET=UTF8;

USE store;

-- 用户表
CREATE TABLE users(
	userid INT PRIMARY KEY AUTO_INCREMENT,	-- 主键id/用户id
	uname VARCHAR(36), -- 用户名
	securitycode VARCHAR(255), -- token安全码
	uAvatar VARCHAR(255),	-- 头像
	email VARCHAR(32),	-- 邮箱地址
	phone VARCHAR(32),	-- 手机号
	upwd VARCHAR(32),	-- 密码
	sex BOOLEAN,	-- 性别
	fllowers INT,	-- 关注量
	friends INT,	-- 粉丝
	tips VARCHAR(32),	-- 个人签名
	news INT,	-- 发表动态的数量
	registerDate DATETIME -- 注册时间
);
INSERT INTO users VALUES
(1,'Dre','','http://192.168.0.114:3000/images/users/dre_1.JPG','1418145349@qq.com','13916613305',md5('du42DU!'),1,90,2509,'新常态下的“十三五”弈局',29,now()),
(2,'Zoe','','http://192.168.0.114:3000/images/users/Zoe_2.jpg','42323124@qq.com','13016613305',md5('du42DU!'),0,90,9,'一个人的街头，可遇不可求',1500,now()),
(3,'Gorge','','http://192.168.0.114:3000/images/users/Gorge_3.jpg','emojisdre@gmail.com','13416613305',md5('du42DU!'),1,90,509,'运气',0,now()),
(4,'Rebecca','','http://192.168.0.114:3000/images/users/Rebecca_4.jpg','2132235@qq.com','13516613305',md5('du42DU!'),0,90,29,'感谢遇见！',2,now());

-- 用户关系表
CREATE TABLE frinds(
	frindsId INT PRIMARY KEY AUTO_INCREMENT,  -- 主键id
	relationId INT, -- 朋友id
	userId INT,	-- 用户id
	establishDate DATETIME	-- 创建时间
);
INSERT INTO frinds VALUES(1,2,1,now()),(2,3,1,now()),(3,4,1,now());

-- 动态消息表
CREATE TABLE ownNews(
	userid INT,	-- 用户id
	newsid INT PRIMARY KEY AUTO_INCREMENT,	-- 主键id
	title VARCHAR(32),	-- 标题
	newslike INT,	-- 喜欢数量
	themeimage VARCHAR(255), -- 内容图片
	newstime DATETIME, -- 发表时间
	content TEXT,	-- 文本内容
	spectator INT -- 观看次数
);
INSERT INTO ownNews VALUES(1,1,'商业的本质',90,'http://192.168.0.114:3000/images/news/dre_1_msg.jpg',now(),'[德] 沃尔夫冈·J·蒙森 著；阎克文 译',82),
(1,2,'#社会...#',90,'http://192.168.0.114:3000/images/news/dre_2_msg.jpg',now(),'我只关心未来，因为我的余生都在那里度过',82);


-- 通讯信息表
CREATE TABLE messages(
	orderId INT PRIMARY KEY AUTO_INCREMENT, --	主键id
	userId INT,	--	用户id
	frindId INT,	--	朋友id
	countId INT,	--	数量id
	createTime DATETIME,	--	创建时间
	msgInfo TEXT	--	内容消息
);
INSERT INTO messages VALUES
(1,1,2,1,now(),"今晚约吗？"),
(2,1,2,2,now(),"老地方见"),
(3,1,2,3,now(),"别走，可以吗？我好爱你"),
(4,1,3,1,now(),"在这个moment我想对你说三个字"),
(5,1,3,2,now(),"还有几天？"),
(6,1,3,3,now(),"下班前给我"),
(7,1,4,1,now(),"没有"),
(8,1,4,2,now(),"多少"),
(9,1,4,3,now(),"那家馆子在哪？"),
(10,2,1,1,now(),"此刻实我独享的moment。小白兔白又白，屁股给我翘起来"),
(11,3,1,1,now(),"人在屋檐下，不得不低头"),
(12,1,2,3,now(),"hetui~,变态"),
(13,2,1,2,now(),"How are u");
