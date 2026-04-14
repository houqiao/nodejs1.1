var express = require('express')
var global = require('../global.js');

var app = express.Router();

app.get('/free_throw', (req, res) => {
  var sqlTotal = 'select * from free_throw limit ?,?'
  var row = req.query
  var connect = global.connection()
  // console.log('---', row)
  connect.query(sqlTotal, [(parseInt(row.current || 1) - 1) * parseInt(row.size || 20), parseInt(row.size) || 20], (err, result) => {
    console.log('---', err)
    if (err) return
    if (!err) {
      console.log('---', result)
      res.json({
        code: 200,
        message: 'success',
        data: result
      })
    }
    connect.end()
  })
})

app.get('/hook', (req, res) => {
  var sqlTotal = 'select * from hook limit ?,?'
  var connect = global.connection()
  connect.query(sqlTotal, [0, 20], (err, result) => {
    if (err) return
    if (!err) {
      console.log('---', result)
      res.json({
        code: 200,
        message: 'success',
        data: result
      })
    }
    connect.end()
  })
})
app.get('/three_points', (req, res) => {
  var sqlTotal = 'select * from three_points limit ?,?'
  var connect = global.connection()
  connect.query(sqlTotal, [0, 20], (err, result) => {
    if (err) return
    if (!err) {
      console.log('---', result)
      res.json({
        code: 200,
        message: 'success',
        data: result
      })
    }
    connect.end()
  })
})

module.exports = app;