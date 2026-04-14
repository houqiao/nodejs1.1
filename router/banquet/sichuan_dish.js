var express = require('express')
var global = require('../../global')
var app = express.Router()

app.get('/getSichuanDish', (req, res) => {
  var sql = 'select * from sichuan_dish limit ?,?'
  const row = req.query
  const param = [0, 20]
  const connect = global.connection()
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log('---', err)
      return
    }
    res.json({
      code: 200,
      message: 'success',
      data: data
    })
    connect.end()
  })
})

app.post('/addSichuanDish', (req, res) => {
  var sql = 'INSERT INTO sichuan_dish (Id, name, materials, step) VALUES(0,?,?,?)'
  const row = req.query
  const param = [row.name, row.materials, row.step]
  const connect = global.connection()
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log('---', err)
      return err
    }
    res.json({
      code: 200,
      message: 'success',
      data:  data
    })
    connect.end()
  })
})
app.post('/editSichuanDish', (req, res) => {
  const row = req.query
  var sql = 'UPDATE sichuan_dish SET  name = ?, materials = ?, step = ? WHERE id =' + row.id
  const connect = global.connection()
  const param = [row.name, row.materials, row.step, row.id]
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log('---', err)
      return
    }
    res.json({
      code: 200,
      message: 'success',
      data: data
    })
    connect.end()
  })
})

app.post('/deleteSichuanDish', (req, res) => {
  const row = req.query
  var sql = 'DELETE from sichuan_dish WHERE id =' + row.id
  const connect = global.connection()
  connect.query(sql, (err, data) => {
    if (err) {
      console.log("---", err)
      return
    }
    res.json({
      code: 200,
      message: 'success',
      data: data
    })
    connect.end()
  })
})

app.post('/DetailSichuanDish', (req, res) => {
  const row = req.query
  var sql = 'select * from sichuan_dish where id =' + row.id
  const connect = global.connection()
  connect.query(sql, (err, data) => {
    if (err) {
      console.log(err, "----")
      return
    }
    res.json({
      code: 200,
      message: 'success',
      data: data[0] || {}
    })
    connect.end()
  })
})

module.exports = app