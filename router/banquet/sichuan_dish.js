var express = require('express')
var global = require('../../global')
var app = express.Router()

app.get('/getSichuanDish', (req, res) => {
  var sql = 'select * from sichuan_dish where user_id = ? limit ?,?'
  const param = [req.user.id, 0, 20]
  const connect = global.connection()
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log('---', err)
      return
    }
    res.json({ code: 200, message: 'success', data: data })
    connect.end()
  })
})

app.post('/addSichuanDish', (req, res) => {
  var sql = 'INSERT INTO sichuan_dish (Id, name, materials, step, user_id) VALUES(0,?,?,?,?)'
  const row = req.query
  const param = [row.name, row.materials, row.step, req.user.id]
  const connect = global.connection()
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log('---', err)
      return err
    }
    res.json({ code: 200, message: 'success', data: data })
    connect.end()
  })
})

app.post('/editSichuanDish', (req, res) => {
  const row = req.query
  var sql = 'UPDATE sichuan_dish SET name = ?, materials = ?, step = ? WHERE id = ? and user_id = ?'
  const connect = global.connection()
  const param = [row.name, row.materials, row.step, row.id, req.user.id]
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log('---', err)
      return
    }
    res.json({ code: 200, message: 'success', data: data })
    connect.end()
  })
})

app.post('/deleteSichuanDish', (req, res) => {
  const row = req.query
  var sql = 'DELETE from sichuan_dish WHERE id = ? and user_id = ?'
  const connect = global.connection()
  connect.query(sql, [row.id, req.user.id], (err, data) => {
    if (err) {
      console.log('---', err)
      return
    }
    res.json({ code: 200, message: 'success', data: data })
    connect.end()
  })
})

app.post('/DetailSichuanDish', (req, res) => {
  const row = req.query
  var sql = 'select * from sichuan_dish where id = ? and user_id = ?'
  const connect = global.connection()
  connect.query(sql, [row.id, req.user.id], (err, data) => {
    if (err) {
      console.log(err, '----')
      return
    }
    res.json({ code: 200, message: 'success', data: data[0] || {} })
    connect.end()
  })
})

module.exports = app