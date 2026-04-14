
var express = require('express')
var os = require('os')
var global = require('../global.js');

var app = express.Router();
app.post('/auth/login', (req, res) => {
  var row  = req.body
  var  sql = 'SELECT * FROM `user` WHERE userName = ' + row.useName
  const connect = global.connection()
  connect.query(sql, (err, result) => {
    console.log('----', result)
    if (err) return
    data = result || []
    console.log('---', data)
    if (!data.length) {
      res.json({
        code: 10000,
        message: '没有该账号',
        success: false,
        data: null
      })
      connect.end()
      return
    } else if (data.length && data[0].password !== row.password) {
      res.json({
        code: 10000,
        message: '密码错误',
        success: false,
        data: data[0].password
      })
      connect.end()
      return
    } else {
      res.json({
        code: 200,
        message: 'success',
        data: data[0] || {},
        success: true,
      })
      connect.end()
    }
  })
})
app.post('/addLoginLog', (req, res) => {
const networksObj = os.networkInterfaces();
const networkRes = networksObj["以太网"] && networksObj["以太网"][0]
console.log('---', JSON.stringify(networksObj))
  var params = [new Date(),  req.headers['x-forwarded-for'] || req.socket.remoteAddress, os.platform(), os.release(), os.hostname(),]
  var sql = 'INSERT INTO user_login_log(Id,date,ip,area,browser,equipment) VALUES(0,?,?,?,?,?)';
  const connect = global.connection()
  console.log('--', params)
  connect.query(sql, params, (err, reStorey) => {
    console.log('--', err)
    if (err) return
    res.json({
      code: 200,
      message: 'success',
      data: {
        query: res.query
      }
    })
    console.log('--', reStorey)
    connect.end()
  })
})

app.get('/getLoginLog', (req, res) => {
  var params = [(parseInt(req.query.current || 1) - 1) * parseInt(req.query.size || 20), parseInt(req.query.size || 20)]
  var sql = "select * from user_login_log limit ?,?";
  var aqlTotal = 'select count(*) as total from user_login_log'
  const connect = global.connection()
  let data = []
  connect.query(sql, params, (err, resAll) => {
    console.log('--', resAll)
    if (err) return
    data = resAll
    connect.query(aqlTotal, (err, resTotal) => {
      if (err) console.log('---', err)
      if (!err) {
        const total = resTotal[0]['total'] || 0
        res.json({
          code: 200,
          message: 'success',
          data: {
            records: data,
            current: req.query.current,
            size: req.query.size,
            total: total
          }
        })
        connect.end()
      }
    })
  })
})

app.post('/user/current', (req, res) => {
  res.json({
    code: 200,
    data: {
      authorityResources: 666
    },
    success: true
  })
})

// const addLogin = () => {

// }
module.exports = app 