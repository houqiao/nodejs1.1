var express = require('express')
var global = require('../global')

var app = express.Router()

app.get('/getWebfrond', (req, res) => {
  var params = [(parseInt(req.query.current || 1) -1) * parseInt(req.query.size || 20), parseInt(req.query.size || 20)]
  var sql = "select * from webfrond limit ?,?";
  const connect = global.connection()
  connect.query(sql, params, (err, resll) => {
    if (err) {
      console.log(err, '---')
      return
    }
    res.json({
      code: 200,
      message: 'success',
      data: {
        records: resll,
        current: req.query.current,
        size: req.query.size,
        total: 1
      }
    })
    connect.end()
  })
})
app.post('/addWebfrond', (req, res) => {
  var sql = 'INSERT INTO webfrond(Id, name, descd, detail) VALUES(0,?,?,?)'
  const connect = global.connection()
  const params = [req.query.title, req.query.desc, req.query.detail]
  connect.query(sql, params, (err, resll) => {
    if (err) {
      console.log(err)
      return
    } else {
      res.json({
        code: 200,
        status: 'success',
        data: resll,
        message: 'success'
      })
    }
    connect.end()
  })
})
app.post('/editWebfrond', (req, res) => {
  var sql = 'UPDATE webfrond SET name = ?, descd = ?, detail = ?  WHERE Id = ?'
  const connect = global.connection()
  const row = req.query
  const params = [row.title, row.desc, row.detail, row.id]
  console.log(params)
  connect.query(sql, params, (err, resll) => {
    if (err) {
      console.log(err)
      return
    }
    res.json({
      code: 200,
      status: 'success',
      message: 'success',
      data: resll
    })
    connect.end()
  })
})

app.post('/getWebFrondDetail', (req, res) => {
  var row = req.query
  console.log('---', row)
  var sql = 'SELECT * FROM webfrond WHERE id =' + row.id
  const connect = global.connection()
  connect.query(sql, (err, resll) => {
    if (err) {
      console.log(err)
      return
    }
    res.json({
      code: 200,
      status: 'success',
      message: 'success',
      data: resll[0] || {}
    })
    connect.end()
  })
})

module.exports = app;