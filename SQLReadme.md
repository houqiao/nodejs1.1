## 增
- INSERT INTO 名字(Id,数据库表头) VALUES(0,?)
## 删
- DELETE FROM  名字 where id=
## 改
- UPDATE 名字 SET 数据库表头 = ?  WHERE Id = ?
## 查
- SELECT * FROM 名字 WHERE id = 
## 分页
- select * from 名字 limit ?,?
## 总数
- select count(*) as total from 名字
## 备份数据库

## 外网连接数据库
- 使用 mysql 命令行工具以 root 用户或具有足够权限的用户身份登录。
- mysql -u root -p
- 输入密码后，选择 mysql 数据库
- use mysql;
- 查看当前的用户和权限设置
- select host, user from user;
- 更新对应用户的权限，允许从任何主机连接。
- update user set host = '%' where user = 'your_username';
- 刷新权限
- flush privileges;
 ## 访问8.0等高版本数据库报错：Client does not support authentication protocol requested by server; consider upgrading MySQL client（客户端不支持服务器请求的身份验证协议；请考虑升级MySQL客户端）
 - 输入命令修改相关机密方法
 - alter user 'root'@'%' identified by 'password' password expire never;
 - alter user 'root'@'%' identified with mysql_native_password by 'password';//password是自己新修改的密码。
 - flush privileges;再次刷新一下权限配置。
  ## mysql的my.ini文件无法修改怎么解决
  将my.ini文件复制到另一个位置，例如桌面。然后，在桌面上进行修改，并将修改后的文件替换原来的my.ini文件。
## 在MySQL登录时出现Access denied for user 'root'@'localhost' (using password: YES) 拒绝访问
到安装的MySQL的目录下，找my.ini文件
在[mysqld]后添加skip-grant-tables（使用 set password for设置密码无效，且此后登录无需键入密码）

skip-grant-tables