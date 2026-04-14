var express = require('express')
var global = require('../../global')
var app = express.Router()

app.get('/getSuDish', (req, res) => {
  var sql = 'select * from su_dish limit ?,?'
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

app.post('/addSuDish', (req, res) => {
  var sql = 'INSERT INTO su_dish (Id, name, materials, step) VALUES(0,?,?,?)'
  const row = req.query
  const param = [row.name, row.materials, row.step]
  const connect = global.connection()
  console.log('--', param)
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
app.post('/editSuDish', (req, res) => {
  const row = req.query
  var sql = 'UPDATE su_dish SET  name = ?, materials = ?, step = ? WHERE id =' + row.id
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

app.post('/deleteSuDish', (req, res) => {
  const row = req.query
  var sql = 'DELETE from su_dish WHERE id =' + row.id
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

app.post('/DetailSuDish', (req, res) => {
  const row = req.query
  var sql = 'select * from su_dish where id =' + row.id
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