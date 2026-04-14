var express = require('express')
var app = express.Router()
var global = require('../../global')

app.get('/hourse/list', (req, res) => {
  const connect = global.connection()
  const query = req.query
  let sql = `select * from home  `
  // 
  const param = []
  if (query.name) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} name LIKE '%${query.name}%' `
  }
  if (query.area) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'}  area = ? `
    param.push(query.area)
  }
   sql = sql + ` ORDER BY id DESC `
  sql = sql + `limit ${parseInt(query.size)} offset ${(parseInt(query.current) - 1) * parseInt(query.size)}`
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    connect.query('select count(*) as total from home', (err, datatotal) => {
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
  const param = [query.name, query.area, query.price,query.school,query.metrol,query.commute,query.supporting,query.other]
  const sql = 'insert into home (id,name,area,price,school,metrol,commute,supporting,other) values(0,?,?,?,?,?,?,?,?)'
  connect.query(sql, param, (err, data) => {
    if (err) return
    res.json({
      code: 200,
      data: data,
      message: 'success'
    })
    connect.end()
  })
})

app.post('/hourse/edit', (req,res) => {
  const connect = global.connection()
  const query = req.query
  const param = [query.name, query.area, query.price,query.school,query.metrol,query.commute,query.supporting,query.other]
  const sql = 'update home set  name =?,area = ?,price= ?,school= ?,metrol= ?,commute= ?,supporting= ?,other= ? where id =' + req.query.id
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    res.json({
      code: 200,
      data: data,
      message: 'success'
    })
    connect.end()
  })
})

app.post('/hourse/detail', (req, res) => {
  const connect = global.connection();
  const query = req.query
  const sql = 'select * from home where id ='+ query.id
  connect.query(sql, (err, data) => {
    if (err) return
    res.json({
      code: 200,
      data: data[0],
      message: 'success'
    })
    connect.end()
  })
})

app.post('/hourse/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete  from home where id=' + query.id
  connect.query(sql, (err, data) => {
    if (err) return
    res.json({
      code: 200,
      data: data,
      message: 'success'
    })
    connect.end()
  })
})

module.exports = app