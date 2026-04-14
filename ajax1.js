var express =  require('express')
var mysql  = require('mysql');  
var  sql = 'SELECT * FROM websites';
var  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
var  addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
const bodyParser=require("body-parser");

 

// 解析以 application/json 和 application/x-www-form-urlencoded 提交的数据

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express()
var history = require('connect-history-api-fallback');
var data = {}


app.listen(8000 ,() => console.log('启动中'))
app.get('/one',jsonParser, (req, res) => {
//查
  console.log(req.query)
  var params = [(parseInt(req.query.current || 1) - 1) * parseInt(req.query.size || 20), parseInt(req.query.size || 20)]
  sql = "select * from websites limit ?,?";
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    port: '3306',     
    database: 'test'
  });
  connection.connect();
  connection.query(sql, params, function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - ',err.message);
      return;
    }

  console.log('--------------------------SELECT----------------------------');
  data = result
  let sqlTotal = 'select count(*) as total from websites' //as更换名称
    connection.query(sqlTotal, function (error, among) {
        if (error) {
            console.log(error);
        } else {
            let total = among[0]['total'] //查询表中的数量
            res.json({
                result: 1,
                status: 200,
                message: "success",
                data: result,
                current: req.query.current,
                size: req.query.size,
                total: total
            })
        }
    })
  // console.log(result);
  console.log('------------------------------------------------------------\n\n');  
  });
  // connection.end();
})
app.post('/add',jsonParser, (req, res) => {
  // addSqlParams = []
  var connection = mysql.createConnection({     
    host     : 'localhost',       
    user     : 'root',       
    password : '123456',       
    port: '3306',                   
    database: 'test'
  }); 
  connection.connect();
  console.log('INSERT ID:',req.body);
  addSqlParams = req.body.web
  connection.query(addSql, addSqlParams, function (err, result) {
    if(err){
     console.log('[INSERT ERROR] - ',err.message);
     return;
    }
  
    console.log('--------------------------INSERT----------------------------');     
    console.log('INSERT ID:',result);        
    console.log('-----------------------------------------------------------------\n\n');  
    res.json({ data: { message: '新增成功', query: res.query, data: res.params }})
    connection.end();
  });
})
app.post('/delete', jsonParser, (req, res) => {
  var delSql = 'DELETE FROM `websites` where id='
  // addSqlParams = []
  var connection = mysql.createConnection({
    host     : 'localhost',       
    user     : 'root',       
    password : '123456',       
    port: '3306',                   
    database: 'test'
  });
  delSql = delSql + req.body.web;
  connection.connect();
  console.log('INSERT ID:',req.body); 
  connection.query(delSql,function (err, result) {
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      return;
    }
    res.json({ data: { message: '删除成功' }})
   console.log('--------------------------DELETE----------------------------');
   console.log('DELETE affectedRows',result.affectedRows);
   console.log('-----------------------------------------------------------------\n\n');  
  //  connection.end();
  });
})
app.post('/edit',jsonParser, (req, res) => {
  var connection = mysql.createConnection({
    host     : 'localhost',       
    user     : 'root',       
    password : '123456',       
    port: '3306',                   
    database: 'test'
  });
  var modSql = 'UPDATE websites SET alexa = ?, country = ?, name = ?,url = ? WHERE Id = ?';
  var modSqlParams = req.body.web;
  //改
  connection.query(modSql,modSqlParams,function (err, result) {
     if(err){
           console.log('[UPDATE ERROR] - ',err.message);
           return;
     }
    console.log('--------------------------UPDATE----------------------------');
    console.log('UPDATE affectedRows',result.affectedRows);
    console.log('-----------------------------------------------------------------\n\n');
    res.json({ data: { message: '编辑成功' }})
    connection.end();
  });
})
app.use(history())
// connection.end();