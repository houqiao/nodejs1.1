var express = require('express')
var app = express.Router()
var global = require('../../global.js')

app.get('/stock/list', (req, res) => {
  const connect = global.connection()
  let sql = 'select * from stock where user_id = ? '
  const { current, size, Name, type, owned } = req.query
  const param = [req.user.id]
  if (Name) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} name like '%${Name}%'` 
  }
  if (type) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} type = ?`
    param.push(type)
  }
  if (owned) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} owned = ?` 
    param.push(owned)
  }
  sql = sql + `limit ${parseInt(size)} offset ${parseInt(current - 1) * parseInt(size)}`
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    connect.query('select count(*) as  total from stock where user_id = ?', [req.user.id], (err, datac) => {
      if (err) {
        console.log(err)
        return
      }
      res.json({
        code: 200,
        message: 'success',
        data: {
          records: data,
          total: datac[0].total
        }
      })
    })
    connect.end()
  })
})

app.post('/stock/detail', (req, res) => {
  const connect = global.connection()
  const sql = 'select * from stock where id = ? and user_id = ?'
  connect.query(sql, [id, req.user.id], (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    res.json({
      code: 200,
      message: 'success',
      data: data[0]
    })
  })
})

app.post('/stock/add', (req, res) => {
  const connect = global.connection()
  const sql = 'insert into stock (name, position, cost, target_position, target_cost, type,owned,other,supporting,user_id) values(?,?,?,?,?,?,?,?,?,?)'
  const { name, position, cost, target_position, target_cost, type,owned,other,supporting } = req.body
  console.log(req.body, '123')
  connect.query(sql, [ name, position, cost, target_position, target_cost, type,owned,other,supporting, req.user.id ], (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    res.json({
      code: 200,
      message: 'success',
      data: data,
    })
  })
})

app.post('/stock/edit', (req, res) => {
  const connect = global.connection()
  const { name, id, position, cost,  target_position, target_cost, type, owned } = req.body
  const sql = 'update stock set name = ?, position = ?, cost = ?, target_position = ?, target_cost = ?, type = ?, owned = ? where id = ? and user_id = ?'
  connect.query(sql, [name, position, cost, target_position, target_cost, type, owned, id, req.user.id], (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    res.json({
      code: 200,
      message: 'success',
      data: data
    })
  })
})

app.post('/stock/delete', (req, res) => {
  const connect = global.connection()
  const { id } = req.query
  const sql = 'delete from stock where id = ? and user_id = ?'
  connect.query(sql, [id, req.user.id], (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    res.json({
      code: 200,
      message: 'success',
      data: data
    })
  })
})

module.exports = app