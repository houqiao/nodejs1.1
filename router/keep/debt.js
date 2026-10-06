const express = require('express')
const app = express.Router()
const global = require('../../global.js')

app.get('/debt/list', (req, res) => {
  const connect = global.connection()
  const sql = 'SELECT * FROM debt WHERE user_id = ? ORDER BY createTime DESC, id DESC'
  connect.query(sql, [req.user.id], (err, data) => {
    if (err) console.log(err)
    res.json({ code: 200, message: 'success', data: data })
    connect.end()
  })
})

app.get('/debt/record/list', (req, res) => {
  const connect = global.connection()
  const sql = 'select r.* from debt_rerd r inner join debt d on r.debt_id = d.id and d.user_id = ? where r.debt_id = ? and r.user_id = ?'
  connect.query(sql, [req.user.id, req.query.debt_id, req.user.id], (err, data) => {
    if (err) console.log(err)
    res.json({ code: 200, message: 'success', data: data.reverse() })
    connect.end()
  })
})

app.post('/debt/record/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.name, query.amount, query.createTime, query.debtId, req.user.id]
  const sql = 'insert into debt_rerd (id,name,amount,createTime,debt_id,user_id) values(0,?,?,?,?,?)'
  connect.query(sql, param, (err, data) => {
    if (err) return
    res.json({ code: 200, data: data, message: 'success' })
    connect.end()
  })
})

app.post('/debt/record/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete from debt_rerd where id = ? and user_id = ?'
  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) return
    res.json({ code: 200, data: data, message: 'success' })
    connect.end()
  })
})

app.post('/debt/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.name, query.amount, query.remain_amount, query.desc, query.createTime, query.endTime, req.user.id]
  const sql = 'insert into debt (id,name,amount,remain_amount,descd,createTime,endTime,user_id) values(0,?,?,?,?,?,?,?)'
  connect.query(sql, param, (err, data) => {
    if (err) return
    res.json({ code: 200, data: data, message: 'success' })
    connect.end()
  })
})

app.post('/debt/edit', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.name, query.amount, query.remain_amount, query.desc, query.createTime, query.endTime, query.id, req.user.id]
  const sql = 'update debt set name = ?, amount = ?, remain_amount = ?, descd = ?, createTime = ?, endTime = ? where id = ? and user_id = ?'
  connect.query(sql, param, (err, data) => {
    if (err) return
    res.json({ code: 200, data: data, message: 'success' })
    connect.end()
  })
})

app.post('/debt/detail', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const sql = 'select * from debt where id = ? and user_id = ?'
  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) return
    res.json({ code: 200, data: data[0], message: 'success' })
    connect.end()
  })
})

app.post('/debt/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete from debt where id = ? and user_id = ?'
  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) return
    res.json({ code: 200, data: data, message: 'success' })
    connect.end()
  })
})

module.exports = app