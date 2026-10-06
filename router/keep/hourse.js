var express = require('express')
var app = express.Router()
var global = require('../../global')

app.get('/hourse/list', (req, res) => {
  const connect = global.connection()
  const query = req.query
  let sql = 'select * from home where user_id = ? '
  const param = [req.user.id]
  if (query.name) {
    sql = sql + 'and name LIKE ? '
    param.push(`%${query.name}%`)
  }
  if (query.area) {
    sql = sql + 'and area = ? '
    param.push(query.area)
  }
  sql = sql + 'ORDER BY id DESC limit ? offset ?'
  param.push(parseInt(query.size || 20), (parseInt(query.current || 1) - 1) * parseInt(query.size || 20))
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    connect.query('select count(*) as total from home where user_id = ?', [req.user.id], (err, datatotal) => {
      res.json({
        code: 200,
        data: {
          records: data,
          total: datatotal[0].total || 0
        },
        message: 'success'
      })
      connect.end()
    })
  })
})

app.post('/hourse/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.name, query.area, query.price, query.school, query.metrol, query.commute, query.supporting, query.other, req.user.id]
  const sql = 'insert into home (id,name,area,price,school,metrol,commute,supporting,other,user_id) values(0,?,?,?,?,?,?,?,?,?)'
  connect.query(sql, param, (err, data) => {
    if (err) return
    res.json({ code: 200, data: data, message: 'success' })
    connect.end()
  })
})

app.post('/hourse/edit', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const param = [query.name, query.area, query.price, query.school, query.metrol, query.commute, query.supporting, query.other, query.id, req.user.id]
  const sql = 'update home set name = ?, area = ?, price = ?, school = ?, metrol = ?, commute = ?, supporting = ?, other = ? where id = ? and user_id = ?'
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    res.json({ code: 200, data: data, message: 'success' })
    connect.end()
  })
})

app.post('/hourse/detail', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'select * from home where id = ? and user_id = ?'
  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) return
    res.json({ code: 200, data: data[0], message: 'success' })
    connect.end()
  })
})

app.post('/hourse/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete from home where id = ? and user_id = ?'
  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) return
    res.json({ code: 200, data: data, message: 'success' })
    connect.end()
  })
})

module.exports = app