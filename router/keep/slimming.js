var express = require('express')
var app  = express.Router()
var global = require('../../global')

// ! list
app.get('/slimming/list', (route, res) => {
  const connection = global.connection()
  const sql = 'select * from slimming where user_id = ? limit ?,?'
  console.log(route.query)
  const param = [route.user.id, parseInt(route.query.size) * parseInt(route.query.current - 1), parseInt(route.query.size || 20) + 20]
  connection.query(sql, param, (err, data) => {
    if (err) {
      console.log('__'+ err)
      return
    } 
    res.json({
      code: 200,
      message: '200',
      data: data
    })
    connection.end()
  })
})

// ! add
app.post('/slimming/add', (req, res) => {
  const connection = global.connection()
  const sql = 'insert into slimming  (id, name, content, "beginDate", "endDate" , weight, info, weekend, user_id) values(0,?,?,?,?,?,?,?,?)'
  var row = req.body
  const param = [row.name, row.content, row.beginDate, row.endDate, row.weight, row.info, row.weekend, row.id, route.user.id]
  console.log(req)
  connection.query(sql, param, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    res.json({
      code: 200,
      message: '200',
      data: data
    })
    connection.end()
  })
})

// ! edit
app.post('/slimming/edit', (route, res) => {
  const connection = global.connection()
  var row = route.query
  const param = [row.name, row.content, row.beginDate, row.endDate, row.weight, row.info, row.weekend, row.id, route.user.id]

  const sql = 'update slimming set  name = ?, content = ?, "beginDate" = ?, "endDate" = ?, weight = ?, info = ?, weekend = ? where id = ? and user_id = ?'
  connection.query(sql, param, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    res.json({
      code: 200,
      message: '200',
      data: data
    })
    connection.end()
  })
})

// ! detail 
app.post('/slimming/detail', (route, res) => {
  const connection = global.connection()
  const sql = 'select * from slimming where id = ? and user_id = ?'
  connection.query(sql, [route.query.id, route.user.id], (err, data) => {
    global.resJson(err, res, data, () => res.json({code: 200, message: 'success', data: data && data.length && data[0]}))
    connection.end()
  })
})

// ! delete 
app.post('/slimming/delete', (route, res) => {
  const connection = global.connection()
  const  sql = 'delete from slimming where id = ? and user_id = ?'
  connection.query(sql, [route.query.id, route.user.id], (err, data) => {
    global.resJson(err, res, data)
    connection.end()
  })
})

module.exports = app