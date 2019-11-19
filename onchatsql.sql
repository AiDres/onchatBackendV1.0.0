-- 配置解码方式
SET NAMES UTF8;

DROP DATABASE IF EXISTS store;

CREATE DATABASE store CHARSET=UTF8;

USE store;

CREATE TABLE users(
	userid INT PRIMARY KEY AUTO_INCREMENT,
	uname VARCHAR(36),
	securitycode VARCHAR(255),
	uAvatar VARCHAR(255),
	email VARCHAR(32),
	phone VARCHAR(32),
	upwd VARCHAR(32),
	sex BOOLEAN,
	fllowers INT,
	friends INT,
	tips VARCHAR(32),
	news INT,
	registerDate DATETIME
);
INSERT INTO users VALUES(1,'Dre','','http://192.168.0.114:3000/images/users/dre_1.JPG','1418145349@qq.com','13916613305',md5('du42DU!'),1,90,2509,'新常态下的“十三五”弈局',29,now());


CREATE TABLE ownnews(
	userid INT,
	newsid INT PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(32),
	newslike INT,
	themeimage VARCHAR(255),
	newstime DATETIME,
	content TEXT,
	spectator INT
);
INSERT INTO ownNews VALUES(1,1,'商业的本质',90,'http://192.168.0.114:3000/images/news/dre_1_msg.jpg',now(),'[德] 沃尔夫冈·J·蒙森 著；阎克文 译',82),
(1,2,'#新时代下的救赎者#',90,'http://192.168.0.114:3000/images/news/dre_2_msg.jpg',now(),'我只关心未来，因为我的余生都在那里度过',82);