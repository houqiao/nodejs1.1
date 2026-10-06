var express = require('express');
var global = require('../../global.js');
var totalGlobal = 0
var app = express.Router();

// ? list
app.get('/getOtherIncome', (req, res) => {
    var params = [req.user.id, (parseInt(req.query.current || 1) - 1) * parseInt(req.query.size || 20), parseInt(req.query.size || 20)]
    sql = "select * from other_income where user_id = ? limit ?,?";
    const connection = global.connection()
    connection.query(sql, params, function (err, result) {
      if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
      }
    data = result
    let sqlTotal = 'select count(*) as total from other_income where user_id = ?' //as更换名称
      connection.query(sqlTotal, [req.user.id], function (error, among) {
        if (error) {
            console.log(error);
        } else {
          let total = among[0]['total'] || 0 //查询表中的数量
          res.json({
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
          connection.end();
        }
      }) 
    });
  })

  // ? add
  app.post('/addOtherIncome', (req, res) => {
  var connection = global.connection() 
  var ll = req.body
  var addSqlParams =  [ll.name, ll.money, ll.date, ll.acount, ll.toWhere, req.user.id];
  var  addSql = 'INSERT INTO other_income(Id,name,money,date,acount,toWhere,user_id) VALUES(0,?,?,?,?,?,?)';
  connection.query(addSql, addSqlParams, function (err, result) {
    if(err){
     console.log('[INSERT ERROR] - ',err.message);
     return;
    }      
    res.json({ data: { message: '新增成功', query: res.query, data: res.params }, code: 200})
    connection.end();
  });
})

// ? delete
app.post('/DeleteOtherIncome', (req, res) => {
  var delSql = 'DELETE FROM `other_income` where id = ? and user_id = ?'
  var connection = global.connection();
  
  connection.query(delSql, [req.body.id, req.user.id], function (err, result) {
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      return;
    }
    res.json({code: 200, data: { message: '删除成功' }})
   connection.end();
  });
})

// ? edit
app.post('/EditOtherIncome', (req, res) => {
  var connection = global.connection()
  var modSql = 'UPDATE other_income SET name = ?, money = ?, date = ?, acount = ?, toWhere = ?  WHERE Id = ? and user_id = ?';
  var ll = req.body
  console.log('参数', ll)
  var modSqlParams =  [ll.name, ll.money, ll.date, ll.acount, ll.toWhere, ll.id, req.user.id];
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