var express = require('express')
var global = require('../../global')
var app = express.Router()

app.get('/delever', (req, res) => {
  var connect = global.connection()
  var sql = 'select * from delever where user_id = ? limit ?,?'
  var param = [req.user.id, 0, 20]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

app.post('/addDelever', (req, res) => {
  var connect = global.connection()
  var sql = `insert into delever (id, name, money, date, acount, toWhere, user_id) values(0,?,?,?,?,?,?)`
  var query = req.query
  var param = [query.name, query.money, query.date, query.acount, query.toWhere, req.user.id]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, [])
    connect.end()
  })
})

app.post('/editDelever', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = 'update delever set name = ?, money = ?, date = ?, acount = ?, toWhere = ? where id = ? and user_id = ?'
  var param = [query.name, query.money, query.date, query.acount, query.toWhere, query.id, req.user.id]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

app.post('/deleteDelever', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = 'delete from delever where id = ? and user_id = ?'
  connect.query(sql, [query.id, req.user.id], (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

module.exports = app