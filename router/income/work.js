var express = require('express');
var global = require('../../global')
var totalGlobal = 0
// var ObjectID = require('mongdb').ObjectID; // 查询ID模块
var app = express.Router();

app.get('/one', (req, res) => {
  //查
    var params = [(parseInt(req.query.current || 1) - 1) * parseInt(req.query.size || 20), parseInt(req.query.size || 20)]
    sql = "select * from income limit ?,?";
    var connection = global.connection();
    connection.query(sql, params, function (err, result) {
      if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
      }
  
    console.log('--------------------------SELECT----------------------------');
    data = result.reverse()
    let sqlTotal = 'select count(*) as total from income' //as更换名称
      connection.query(sqlTotal, function (error, among) {
          if (error) {
              console.log(error);
          } else {
              let total = among[0]['total'] || 0 //查询表中的数量
              res.json({
                  result: 1,
                  status: 200,
                  code: 200,
                  message: "success",
                  data: {
                    records: result,
                    current: req.query.current || 1,
                    size: req.query.size || 20,
                    total: total + '' || 1
                  },
              })
              totalGlobal = total
          }
      })
    // console.log(result);
    console.log('------------------------------------------------------------\n\n');  
    });
    // connection.end();
  })
  app.post('/addShort', (req, res) => {
  // addSqlParams = []
  var connection = global.connection();
  var ll = req.body
  var addSqlParams =  [ll.name, ll.money, ll.date, ll.acount, ll.toWhere];
  console.log('INSERT ID:',addSqlParams)
  var  addSql = 'INSERT INTO income(Id,name,money,date,acount,toWhere) VALUES(0,?,?,?,?,?)';
  connection.query(addSql, addSqlParams, function (err, result) {
    if(err){
     console.log('[INSERT ERROR] - ',err.message);
     return;
    }

    res.json({ data: { message: '新增成功', query: res.query, data: res.params }, code: 200})
    connection.end();
  });
})

app.post('/deleteShort', (req, res) => {
  var delSql = 'DELETE FROM `income` where id='
  // addSqlParams = []
  var connection = global.connection();
  delSql = delSql + req.body.id;
  console.log('INSERT ID:',req.body); 
  connection.query(delSql,function (err, result) {
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      return;
    }
    res.json({code: 200, data: { message: '删除成功' }})
   console.log('--------------------------DELETE----------------------------');
   console.log('-----------------------------------------------------------------\n\n');  
  //  connection.end();
  });
})
app.post('/editShort', (req, res) => {
  var connection = global.connection();
  var modSql = 'UPDATE income SET name = ?, money = ?, date = ?, acount = ?, toWhere = ?  WHERE Id = ?';
  var ll = req.body
  console.log('参数', ll)
  var modSqlParams =  [ll.name, ll.money, ll.date, ll.acount, ll.toWhere, ll.id];
  //改
  connection.query(modSql,modSqlParams,function (err, result) {
     if(err){
           console.log('[UPDATE ERROR] - ',err.message);
           return;
     }
    res.json({ code: 200, data: { message: '编辑成功' }})
    connection.end();
  });
})
module.exports = app;
