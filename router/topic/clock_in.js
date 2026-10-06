var express = require('express')
var global = require('../../global')
var app = express.Router()
// ? list clock in
app.get('/getClockIn', (req, res) => {
  const sql = 'select * from clock_in where user_id = ? limit ?,?'
  const param = [req.user.id, 0, 40]
  const connect = global.connection()
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

// ? list get want clock
app.post('/getWantClock', (req, res) => {
  const sql = 'select * from clock_in where user_id = ? and "beginDate" like ?'
  const connect = global.connection()
  connect.query(sql, [req.user.id, `%${req.query.beginDate}%`], (err, data) => {
    console.log(data)
    // res.json({code: 200, message: 'success', data: data.length && data[0]})
    global.resJson(err, res, data, () =>  res.json({code: 200, message: 'success', status: true, data: data && data.length && data[0]}))
    connect.end()
  })
})

// ? do clock in
app.post('/donClockIn', (req, res) => {
  const sql = 'insert into clock_in  (id, name, "beginDate", user_id) values(0, ?, ?, ?)'
  const query = req.query
  const param = [query.name, query.beginDate, req.user.id]
  const connect = global.connection()
  connect.query(sql, param, (err, data) => {
    global.resJson(err, res, data)
    connect.end()
  })
})

module.exports = app
