var express = require('express')
var global = require('../../global')
var app = express.Router()

app.get('/studies_list', (req, res) => {
  var connect = global.connection()
  var sql = 'select * from studies_list where user_id = ? limit ?,?'
  var param = [req.user.id, 0, 40]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

app.post('/studies_add', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = 'insert into studies_list (id, year, old, month, study, skill, detail, user_id) values(0,?,?,?,?,?,?,?)'
  var param = [query.year, query.old, query.month, query.study, query.skill, query.detail, req.user.id]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

app.post('/studies_edit', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = 'update studies_list set year = ?, old = ?, month = ?, study = ?, skill = ?, detail = ? where id = ? and user_id = ?'
  var param = [query.year, query.old, query.month, query.study, query.skill, query.detail, query.id, req.user.id]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

app.post('/studies_detail', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = 'select * from studies_list where id = ? and user_id = ?'
  connect.query(sql, [query.id, req.user.id], (err, data) => {
    global.resJson(err, res, data, () => res.json({code: 200, message: 'success', data: data && data.length && data[0]}))
    connect.end()
  })
})

app.post('/studies_delete', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = 'delete from studies_list where id = ? and user_id = ?'
  connect.query(sql, [query.id, req.user.id], (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

module.exports = app