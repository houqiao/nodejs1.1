var express = require('express')
var app = express.Router()
var global = require('../../global')

app.get('/freedom/list', (req, res) => {
  const connect = global.connection()
  const query = req.query
  let sql = 'select * from travel_fund where user_id = ? '
  const param = [req.user.id]

  if (query.title) {
    sql = sql + 'and title LIKE ? '
    param.push(`%${query.title}%`)
  }
  if (query.year) {
    sql = sql + 'and year = ? '
    param.push(query.year)
  }
  if (query.completed !== undefined) {
    sql = sql + 'and completed = ? '
    param.push(query.completed)
  }

  sql = sql + 'ORDER BY id DESC limit ? offset ?'
  param.push(parseInt(query.size || 20), (parseInt(query.current || 1) - 1) * parseInt(query.size || 20))

  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    connect.query('select count(*) as total from travel_fund where user_id = ?', [req.user.id], (err, datatotal) => {
      res.json({
        code: 200,
        data: {
          records: data,
          total: datatotal[0].total || 0
        },
        message: 'success',
        success: true
      })
      connect.end()
    })
  })
})

app.post('/freedom/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.year, query.title, query.targetAmount, query.currentAmount, query.description, query.completed || false, query.completedDate, req.user.id]
  const sql = 'insert into travel_fund (id,"year","title","targetAmount","currentAmount","description","completed","completedDate",user_id) values(0,?,?,?,?,?,?,?,?)'

  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log(err)
      res.json({ code: 500, message: '添加失败', success: false })
      return
    }
    res.json({ code: 200, data: data, message: 'success', success: true })
    connect.end()
  })
})

app.post('/freedom/edit', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.year, query.title, query.targetAmount, query.currentAmount, query.description, query.completed || false, query.completedDate, query.id, req.user.id]
  const sql = 'update travel_fund set "year" = ?, "title" = ?, "targetAmount" = ?, "currentAmount" = ?, "description" = ?, "completed" = ?, "completedDate" = ? where id = ? and user_id = ?'

  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    res.json({ code: 200, data: data, message: 'success', success: true })
    connect.end()
  })
})

app.post('/freedom/detail', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'select * from travel_fund where id = ? and user_id = ?'

  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) return
    res.json({ code: 200, data: data[0], message: 'success', success: true })
    connect.end()
  })
})

app.post('/freedom/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete from travel_fund where id = ? and user_id = ?'

  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) return
    res.json({ code: 200, data: data, message: 'success', success: true })
    connect.end()
  })
})

module.exports = app