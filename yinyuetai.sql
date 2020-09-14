/*
Navicat MySQL Data Transfer

Source Server         : test
Source Server Version : 50173
Source Host           : localhost:3306
Source Database       : yinyuetai

Target Server Type    : MYSQL
Target Server Version : 50173
File Encoding         : 65001

Date: 2020-09-14 11:38:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) NOT NULL,
  `pwd` char(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('1', 'admin', '123456abc');

-- ----------------------------
-- Table structure for lunbo
-- ----------------------------
DROP TABLE IF EXISTS `lunbo`;
CREATE TABLE `lunbo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pic_name` varchar(255) DEFAULT NULL,
  `pic_src` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of lunbo
-- ----------------------------
INSERT INTO `lunbo` VALUES ('61', '张信哲专辑海报.jpg', 'http://localhost:7001/public/uploadPic/1597228240226张信哲专辑海报.jpg');
INSERT INTO `lunbo` VALUES ('62', '杨和苏专辑海报.jpg', 'http://localhost:7001/public/uploadPic/1597228244799杨和苏专辑海报.jpg');
INSERT INTO `lunbo` VALUES ('63', '吴彤专辑海报.jpg', 'http://localhost:7001/public/uploadPic/1597228249960吴彤专辑海报.jpg');
INSERT INTO `lunbo` VALUES ('64', '苏打绿专辑海报.jpg', 'http://localhost:7001/public/uploadPic/1597228254004苏打绿专辑海报.jpg');
INSERT INTO `lunbo` VALUES ('65', '沈以诚专辑海报.jpg', 'http://localhost:7001/public/uploadPic/1597228258962沈以诚专辑海报.jpg');
INSERT INTO `lunbo` VALUES ('66', '陈奕迅专辑海报.jpg', 'http://localhost:7001/public/uploadPic/1597228264422陈奕迅专辑海报.jpg');
INSERT INTO `lunbo` VALUES ('67', '肥皂菌专辑海报.jpg', 'http://localhost:7001/public/uploadPic/1597228271234肥皂菌专辑海报.jpg');

-- ----------------------------
-- Table structure for music
-- ----------------------------
DROP TABLE IF EXISTS `music`;
CREATE TABLE `music` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `music_name` varchar(255) DEFAULT NULL,
  `music_src` varchar(255) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of music
-- ----------------------------
INSERT INTO `music` VALUES ('65', '阿悠悠-旧梦一场.mp3', 'http://localhost:7001/public/uploadMusic/1597228289107阿悠悠-旧梦一场.mp3', '13');
INSERT INTO `music` VALUES ('66', '海来阿木-点歌的人.mp3', 'http://localhost:7001/public/uploadMusic/1597228296387海来阿木-点歌的人.mp3', '13');
INSERT INTO `music` VALUES ('67', '海来阿木-你的万水千山.mp3', 'http://localhost:7001/public/uploadMusic/1597228305370海来阿木-你的万水千山.mp3', '14');
INSERT INTO `music` VALUES ('68', '海伦-桥边姑娘.mp3', 'http://localhost:7001/public/uploadMusic/1597228311477海伦-桥边姑娘.mp3', '14');
INSERT INTO `music` VALUES ('69', '井上あずみ-君をのせて.mp3', 'http://localhost:7001/public/uploadMusic/1597228320074井上あずみ-君をのせて.mp3', '14');
INSERT INTO `music` VALUES ('70', '蓝盈莹-秋花.mp3', 'http://localhost:7001/public/uploadMusic/1597228329336蓝盈莹-秋花.mp3', '15');
INSERT INTO `music` VALUES ('71', '林ゆうき-ヒカリヘ (piano version).mp3', 'http://localhost:7001/public/uploadMusic/1597228335201林ゆうき-ヒカリヘ (piano version).mp3', '15');
INSERT INTO `music` VALUES ('72', '林ゆうき-ヒカリヘ (piano version).mp3', 'http://localhost:7001/public/uploadMusic/1597228347890林ゆうき-ヒカリヘ (piano version).mp3', '16');
INSERT INTO `music` VALUES ('73', '梦然-少年.mp3', 'http://localhost:7001/public/uploadMusic/1597228354530梦然-少年.mp3', '16');
INSERT INTO `music` VALUES ('74', '任然-飞鸟和蝉.mp3', 'http://localhost:7001/public/uploadMusic/1597228365784任然-飞鸟和蝉.mp3', '17');
INSERT INTO `music` VALUES ('75', '日本ACG-海の見える街.mp3', 'http://localhost:7001/public/uploadMusic/1597228374176日本ACG-海の見える街.mp3', '17');
INSERT INTO `music` VALUES ('76', '押尾コータロー-美しき人生.mp3', 'http://localhost:7001/public/uploadMusic/1597228383010押尾コータロー-美しき人生.mp3', '18');
INSERT INTO `music` VALUES ('77', '张韶涵-破茧.mp3', 'http://localhost:7001/public/uploadMusic/1597228406780张韶涵-破茧.mp3', '18');

-- ----------------------------
-- Table structure for musictype
-- ----------------------------
DROP TABLE IF EXISTS `musictype`;
CREATE TABLE `musictype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` char(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of musictype
-- ----------------------------
INSERT INTO `musictype` VALUES ('13', '热门华语');
INSERT INTO `musictype` VALUES ('14', '新歌首发');
INSERT INTO `musictype` VALUES ('15', '怀旧歌曲');
INSERT INTO `musictype` VALUES ('16', 'ACG专区');
INSERT INTO `musictype` VALUES ('17', '轻音乐');
INSERT INTO `musictype` VALUES ('18', '国风歌曲');

-- ----------------------------
-- Table structure for mylove
-- ----------------------------
DROP TABLE IF EXISTS `mylove`;
CREATE TABLE `mylove` (
  `music_id` int(11) DEFAULT NULL,
  `music_name` varchar(255) DEFAULT NULL,
  `music_src` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mylove
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) NOT NULL,
  `pwd` char(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('30', '宋老板', '123456');
