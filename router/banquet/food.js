var express = require('express')
var global = require('../../global.js')
var app = express.Router()

app.get('/foods', (req, res) => {
  var params = [req.user.id, (parseInt(req.query.current || 1) - 1) * parseInt(req.query.pageSize || 20), parseInt(req.query.pageSize || 20)]
  var sql = 'select * from food where user_id = ? limit ?,?'
  var sqlTotal = 'select count(*) as total from food where user_id = ?'
  var connection = global.connection()
  connection.query(sql, params, (err, result) => {
    if (err) return
    connection.query(sqlTotal, [req.user.id], (error, among) => {
      if (error) return
      let total = among[0]['total'] || 0
      res.json({ result: 1, status: 200, code: 200, message: 'success', data: { records: result, current: req.query.current || 1, size: req.query.size || 20, total: total + '' || 1 } })
      connection.end()
    })
  })
})

app.post('/addFood', (req, res) => {
  var connection = global.connection()
  var ll = req.body
  var addSqlParams = [ll.name, ll.fry_cooked_time, ll.boil_cooked_time, ll.steam_cooked_time, ll.fried_cooked_time, ll.roast_cooked_time, ll.pressure_cooked_time, ll.remark, req.user.id]
  var addSql = 'INSERT INTO food(Id,name,fry_cooked_time,boil_cooked_time,steam_cooked_time,fried_cooked_time,roast_cooked_time,pressure_cooked_time,remark,user_id) VALUES(0,?,?,?,?,?,?,?,?,?)'
  connection.query(addSql, addSqlParams, (err, result) => {
    if (err) return
    res.json({ data: { message: '新增成功', query: res.query, data: res.params }, code: 200 })
    connection.end()
  })
})

app.post('/deleteFood', (req, res) => {
  var connection = global.connection()
  var delSql = 'DELETE FROM food where id = ? and user_id = ?'
  connection.query(delSql, [req.body.id, req.user.id], (err, result) => {
    if (err) return
    res.json({ code: 200, data: { message: '删除成功' } })
    connection.end()
  })
})

app.post('/editFood', (req, res) => {
  var connection = global.connection()
  var ll = req.body
  var modSql = 'UPDATE food SET name = ?, fry_cooked_time = ?, boil_cooked_time = ?, steam_cooked_time = ?, fried_cooked_time = ?, roast_cooked_time = ?, pressure_cooked_time = ?, remark = ? WHERE Id = ? and user_id = ?'
  var modSqlParams = [ll.name, ll.fry_cooked_time, ll.boil_cooked_time, ll.steam_cooked_time, ll.fried_cooked_time, ll.roast_cooked_time, ll.pressure_cooked_time, ll.remark, ll.id, req.user.id]
  connection.query(modSql, modSqlParams, (err, result) => {
    if (err) return
    res.json({ code: 200, data: { message: '编辑成功' } })
    connection.end()
  })
})

module.exports = app