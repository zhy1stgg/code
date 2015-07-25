create database hcode;

use hcode;

create table t_user (
  id int primary key auto_increment,
  username varchar(45) not null,
  password varchar(45) not null,
  email varchar(45) not null,
  uid int,
  realname varchar(45),
  phone varchar(20),
  sex int default 0,
  age int default 20,
  url varchar(45),
  status int default 0,
  descriptiton varchar(200),
  background varchar(200),
  create_time timestamp default current_timestamp,
  modify_time timestamp default current_timestamp
);



create table t_code (
  id int primary key auto_increment,
  code varchar(10) not null,
  name varchar(45),
  descriptiton varchar(200),
  layout varchar(20),
  extends_js varchar(45),
  js_code longtext,
  html_code longtext,
  css_code longtext,
  result_image varchar(200),
  cover varchar(200),
  ground int not null,
  creater int not null,
  pv int default 0,
  status int default 0,
  create_time timestamp default current_timestamp,
  modify_time timestamp default current_timestamp
);

--- var statusMap = {
---   0: "正常",
---   1: "停用",
---   1: "删除"
--- };


create table t_group(
  id int primary key auto_increment,
  name varchar(45) not null,
  code varchar(25) not null,
  descriptiton varchar(200),
  background varchar(200),
  status int default 0,
  create_time timestamp default current_timestamp,
  modify_time timestamp default current_timestamp
);

--- var groupRoleMap = {
---   0: "组员",
---   1: "管理员"
---   2: "创建者"
---}

create table t_user_group(
  id int primary key auto_increment,
  user_id int not null,
  ground_id int not null,
  role varchar(20) not null,
  status int default 0,
  create_time timestamp default current_timestamp,
  modify_time timestamp default current_timestamp
);

--- var typeMap = {
---   "code", "user", "group"
----}

--- 收藏表，用于存储用户收藏或关注 代码、用户、组织
create table t_favorite (
  id int primary key auto_increment,
  target_id int not null,
  type varchar(20) not null,
  status int default 0,
  create_time timestamp default current_timestamp,
  modify_time timestamp default current_timestamp
);