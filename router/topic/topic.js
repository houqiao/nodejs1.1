var express = require('express')
var app = express.Router()
var global = require('../../global')

// ? topic detail
app.get('/getTopicDetail', (req, res) => {
  const connect = global.connection()
  const sql = global.sqlDetail('topic', req.query.id)
  connect.query(sql, (err, data) => {
    global.resJson(err, res, data, () => res.json({code: 200, message: 'success', data: data && data.length && data[0]}))
    connect.end()
  })
})

// ? topic list
app.get('/getTopicList', (req, res) => {
  const connect = global.connection()
  const sql = global.sqlList('topic')
  const size = parseInt(req.query.size) || 20
  const current = parseInt(req.query.current) || 1
  const param = [(current - 1) * size, size]
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

// ? topic add
app.post('/addWebTopic', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const param = [query.name, query.type, query.remark, query.detail ]
  const sql = 'insert into topic (id, name, type, remark, detail) values(0,?,?,?,?)'
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

// ? topic edit
app.post('/editWebTopic', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const param = [query.name, query.type, query.detail, query.remark, query.id]
  const sql = 'update topic set  name = ? , type = ?, detail = ?, remark = ? where id = ?'
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

module.exports = app