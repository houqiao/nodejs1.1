var express = require('express')
var global = require('../../global')
var app = express.Router()

app.get('/getBanquet', (req, res) => {
  var sql = 'select * from xiao_banquet limit ?,?'
  var connect = global.connection()
  var param = [0, 24]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
  })
  connect.end()
})

app.post('/addBanquet', (req, res) => {
  var sql = 'insert into xiao_banquet (id, name, type, materials, seasoning, steps, remark) values(0,?,?,?,?,?,?)'
  var row = req.query
  var connect = global.connection()
  var param = [row.name, row.type, row.materials, row.seasoning, row.steps, row.remark]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
  })
  connect.end()
})

app.post('/editBanquet', (req, res) => {
  var row = req.query
  var sql = 'update xiao_banquet set name = ?, type = ?, materials = ?, seasoning = ?, steps = ?, remark = ? where id='+ row.id
  var connect = global.connection()
  var param = [row.name, row.type, row.materials, row.seasoning, row.steps, row.remark]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
  })
  connect.end()
})

app.post('/deleteBanquet', (req, res) => {
  var row = req.query
  var sql = 'delete from xiao_banquet where id =' + row.id
  var connect = global.connection()
  connect.query(sql, (err, data) => {
    global.resJson(err, res, data)
  })
  connect.end()
})

app.post('/detailBanquet', (req, res) => {
  var row = req.query
  var sql = 'select * from xiao_banquet where id=' + row.id
  const connect = global.connection()
  connect.query(sql, (err, data) => {
    global.resJson(err, res, data)
  })
  connect.end()
})

module.exports = app