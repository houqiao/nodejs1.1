var express = require('express');
var totalGlobal = 0
var global = require("../../global.js")
// var ObjectID = require('m\\ongdb').ObjectID; // 查询ID模块
var app = express.Router();
app.get('/foods', (req, res) => {
  //查
  console.log("进来没")
    var params = [(parseInt(req.query.current || 1) - 1) * parseInt(req.query.pageSize || 20), parseInt(req.query.pageSize || 20)]
    sql = "select * from food limit ?,?";
    var connection = global.connection();
    connection.query(sql, params, function (err, result) {
      if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
      }
  
    console.log('--------------------------SELECT----------------------------');
    data = result
    let sqlTotal = 'select count(*) as total from food' //as更换名称
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
  app.post('/addFood', (req, res) => {
    // addSqlParams = []
    var connection = global.connection();
    var ll = req.body
    var addSqlParams =  [ll.name, ll.fry_cooked_time, ll.boil_cooked_time, ll.steam_cooked_time, ll.fried_cooked_time, ll.roast_cooked_time, ll.pressure_cooked_time, ll.remark];
    console.log('INSERT ID:',addSqlParams)
    var  addSql = 'INSERT INTO food(Id,name,fry_cooked_time,boil_cooked_time,steam_cooked_time,fried_cooked_time, roast_cooked_time, pressure_cooked_time, remark) VALUES(0,?,?,?,?,?,?,?,?)';
    connection.query(addSql, addSqlParams, function (err, result) {
      if(err){
       console.log('[INSERT ERROR] - ',err.message);
       return;
      }
    
      console.log('--------------------------INSERT----------------------------');     
      console.log('INSERT ID:',result);        
      console.log('-----------------------------------------------------------------\n\n');  
      res.json({ data: { message: '新增成功', query: res.query, data: res.params }, code: 200})
      connection.end();
    });
  })
  
  app.post('/deleteFood', (req, res) => {
    var delSql = 'DELETE FROM `food` where id='
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
     console.log('DELETE affectedRows',result.affectedRows);
     console.log('-----------------------------------------------------------------\n\n');
    //  connection.end();
    });
  })
  app.post('/editFood', (req, res) => {
    var connection = global.connection();
    var modSql = 'UPDATE food SET name = ?, fry_cooked_time = ?, boil_cooked_time = ?, steam_cooked_time = ?, fried_cooked_time = ?, roast_cooked_time = ?, pressure_cooked_time = ?, remark = ?    WHERE Id = ?';
    var ll = req.body
    console.log('参数', ll)
    var modSqlParams =  [ll.name, ll.fry_cooked_time, ll.boil_cooked_time, ll.steam_cooked_time, ll.fried_cooked_time, ll.roast_cooked_time, ll.pressure_cooked_time, ll.remark, ll.id];
    //改
    connection.query(modSql,modSqlParams,function (err, result) {
       if(err){
             console.log('[UPDATE ERROR] - ',err.message);
             return;
       }
      console.log('--------------------------UPDATE----------------------------');
      console.log('UPDATE affectedRows',result.affectedRows);
      console.log('-----------------------------------------------------------------\n\n');
      res.json({ code: 200, data: { message: '编辑成功' }})
      connection.end();
    });
  })
  module.exports = app;
