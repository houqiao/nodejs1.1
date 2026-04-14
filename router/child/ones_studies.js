var  express = require('express')
var global = require('../../global')
var app = express.Router()

app.get('/studies_list', (req, res) => {
  var connect = global.connection()
  var sql = global.sqlList('studies_list')
  var param = [0, 40]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

app.post('/studies_add', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = `insert into studies_list (id, year, old, month, study, skill, detail) values(0,?,?,?,?,?,?)`
  var param = [query.year, query.old, query.month, query.study, query.skill, query.detail]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})
app.post('/studies_edit', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var param = [query.year, query.old, query.month, query.study, query.skill, query.detail]
  var sql = `update studies_list set year = ?, old = ?, month = ?, study =?, skill = ?, detail = ? where id = ${query.id}`
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

app.post('/studies_detail', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = global.sqlDetail('studies_list', query.id)
  connect.query(sql, (err, data) => {
    global.resJson(err, res, data, () => res.json({code: 200, message: 'success', data: data && data.length && data[0]}))
    connect.end()
  })
})

app.post('/studies_delete', (req, res) => {
  var connect = global.connection()
  var query = req.query
  var sql = `delete from studies where id = ${query.id}`
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})
module.exports = app