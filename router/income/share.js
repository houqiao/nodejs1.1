var express = require('express')
var app = express.Router()
var global = require('../../global.js')

app.get('/stock/list', (req, res) => {
  const connect = global.connection()
  let sql = 'select * from stock '
  const { current, size, Name, type, owned } = req.query
  const param = []
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
    connect.query('select count(*) as  total from stock', (err, datac) => {
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
  const sql = 'select * from stock where id=' + req.body.id
  connect.query(sql, (err, data) => {
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
  const sql = 'insert into stock (id, name, position, cost, target_position, target_cost, type,owned) values(0,?,?,?,?,?)'
  const { name, position, cost, target_position, target_cost, type,owned } = req.body
  connect.query(sql, [ name, position, cost, target_position, target_cost, type,owned ], (err, data) => {
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
  const sql = 'update stock set name = ?, position = ?, cost = ?, target_position = ?, target_cost = ?, type = ?, owned = ? where id = ' + id
  connect.query(sql, [name, position, cost, target_position, target_cost, type,owned], (err, data) => {
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
  const sql = global.sqlDelete(id)
  connect.query(sql, (err, data) => {
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