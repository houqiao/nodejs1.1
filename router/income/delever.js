var express = require('express')
var global = require('../../global')
var app = express.Router()

app.get('/delever', (req, res) => {
  var connect = global.connection()
  var sql = global.sqlList('delever')
  var param = [0, 20]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

app.post('/addDelever', (req, res) => {
  var connect = global.connection()
  var sql = `insert into delever (id, name, money, date, acount, toWhere) values(0,?,?,?,?,?)`
  var query = req.query
  var param = [query.name, query.money, query.date, query.acount, query.toWhere]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, [])
    connect.end()
  })
})

app.post('/editDelever', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = `update delever set name = ?, money = ?, date = ?,  acount = ?, toWhere = ? where id = ${query.id}`
  var param = [query.name, query.money, query.date, query.acount, query.toWhere]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

app.post('/deleteDelever', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql =  `delete delever from where id= ${query.id}`
  connect.query(sql, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

module.exports = app