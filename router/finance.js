var express = require('express')
var global = require('../global.js');

var app = express.Router();

app.get('/getCurrent', (req, res) => {
  var sqlTotal = 'select * from current limit ?,?'
  var row = req.query
  var connect = global.connection()
  // console.log('---', row)
  connect.query(sqlTotal, [(parseInt(row.current || 1) - 1) * parseInt(row.size || 20), parseInt(row.size) || 20], (err, result) => {
    console.log('---', err)
    if (err) return
    if (!err) {
      result = (result || []).map(item => {
        return {
          ...item,
          name: item.name.split(','),
          annual_interet_rate: item.annual_interet_rate.split(',')
        }
      })
      res.json({
        code: 200,
        message: 'success',
        data: {
          result: result,
          end: result[result.length - 1]
        }
      })
    }
    connect.end()
  })
})
app.post('/addCurrent', (req, res) => {
  var row = req.body
  var params = [row.name, row.level_num, row.name, row.description]
  var sql = 'INSERT INTO level_num(Id,name,level_num, date, description) VALUES(0,?,?,?,?)';
  const connect = global.connection()
  console.log('--', params) 
  connect.query(sql, params, (err, reStorey) => {
    console.log('--', err)
    if (err) return
    res.json({
      code: 200,
      message:'success',
      data: {
        query: res.query
      }
    })
    connect.end()
  })
})
app.get('/getFund', (req, res) => {
  var sqlTotal = 'select * from fund limit ?,?'
  var row = req.query
  var connect = global.connection()
  // console.log('---', row)
  connect.query(sqlTotal, [(parseInt(row.current || 1) - 1) * parseInt(row.size || 20), parseInt(row.size) || 20], (err, result) => {
    console.log('---', err)
    if (err) return
    if (!err) {
      res.json({
        code: 200,
        message: 'success',
        data: {
          records: result,
          end: result[result.length - 1]
        }
      })
    }
    connect.end()
  })
})
app.get('/getLevel', (req, res) => {
  var sql = 'select * from level_num limit ?,?'
  var connect = global.connection()
  var param = [0, 20]
  connect.query(sql, param, (err, result) => {
    const setData = {
      name: result.map(item => item.name),
      level_num: result.map(item => item.level_num),
      what: 'what at level'
    }
    global.resJson(err, res, setData)
  })
  connect.end()
})
app.post('/addFund', (req, res) => {
  var row = req.body
  var params = [row.name, row.number, row.type, row.origin, row.riskLevel]
  var sql = 'INSERT INTO fund(Id,name,number,type,origin,riskLevel) VALUES(0,?,?,?,?,?)';
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
    connect.end()
  })
})
app.post('/editFund', (req, res) => {
  var row = req.body
  var params = [row.name, row.number, row.type, row.origin, row.riskLevel, row.id]
  var sql = 'UPDATE fund SET name = ?, number = ?, type = ?, origin = ?, riskLevel = ?  WHERE Id = ?'
  const connect = global.connection()
  connect.query(sql, params, (err, result)=> {
    console.log('--', err)
    if (err) return
    res.json({
      code: 200,
      message: 'success',
      data: {}
    })
    console.log('----', 'success')
    connect.end()
  })
})
app.post('/deleteFund', (req, res) => {
  var row = req.body
  var sql = 'DELETE FROM  `fund` where id=' + row.id
  const connect = global.connection()
  connect.query(sql, (err, result) => {
    if (err) return
    res.json({
      code: 200,
      message: 'success',
      data: {
        query: res.query
      }
    })
    console.log('----', '删除成功')
    global.connection.end()
  })
})
module.exports = app