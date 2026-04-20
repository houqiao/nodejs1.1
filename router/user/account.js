var express = require('express')
var app = express.Router()
var global = require('../../global')

app.post('/login', (req, res) => {
  var row = req.body
  var params = [row.username, row.password]
  var sql = 'SELECT * FROM user WHERE username = ? AND password = ?'
  const connect = global.connection()
  connect.query(sql, params, (err, result) => {
    if (err) return
    if (result.length > 0) {
      res.json({
        code: 200,
        message: 'success',
        data: {
          username: result[0].username
        }
      })
    } else {
      res.json({
        code: 400,
        message: 'error',
        data: {}
      })
    }
  })
  connect.end()
})

module.exports = app
