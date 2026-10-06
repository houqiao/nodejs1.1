var express = require('express')
var global = require('../../global.js')
var app = express.Router()

app.get('/hourse', (req, res) => {
  var params = [req.user.id, (parseInt(req.query.current || 1) - 1) * parseInt(req.query.size || 20), parseInt(req.query.size || 20)]
  var sql = 'select * from hourse where user_id = ? limit ?,?'
  var aqlTotal = 'select count(*) as total from hourse where user_id = ?'
  const connect = global.connection()
  connect.query(sql, params, (err, resAll) => {
    if (err) return
    const data = resAll.map(item => ({
      ...item,
      desc: item.descd,
      step: JSON.parse(item.stepd),
      materials: JSON.parse(item.materials)
    }))
    connect.query(aqlTotal, [req.user.id], (err, resTotal) => {
      if (err) console.log('---', err)
      if (!err) {
        const total = resTotal[0]['total'] || 0
        res.json({ code: 200, message: 'success', data: { records: data, current: req.query.current, size: req.query.size, total: total } })
        connect.end()
      }
    })
  })
})

app.post('/addHourse', (req, res) => {
  var row = req.body
  var params = [row.name, row.detail, row.desc, JSON.stringify(row.step), JSON.stringify(row.materials), row.type, req.user.id]
  var sql = 'INSERT INTO hourse(Id,name,detail,descd,stepd,materials,type,user_id) VALUES(0,?,?,?,?,?,?,?)'
  const connect = global.connection()
  connect.query(sql, params, (err, reStorey) => {
    if (err) return
    res.json({ code: 200, message: 'success', data: { query: res.query } })
    connect.end()
  })
})

app.post('/deleteHourse', (req, res) => {
  var row = req.body
  var sql = 'DELETE FROM hourse where id = ? and user_id = ?'
  const connect = global.connection()
  connect.query(sql, [row.id, req.user.id], (err, result) => {
    if (err) return
    res.json({ code: 200, message: 'success', data: { query: res.query } })
    connect.end()
  })
})

app.post('/editHourse', (req, res) => {
  var row = req.body
  var params = [row.name, row.detail, row.desc, JSON.stringify(row.step), JSON.stringify(row.materials), row.type, row.id, req.user.id]
  var sql = 'UPDATE hourse SET name = ?, detail = ?, descd = ?, stepd = ?, materials = ?, type = ? WHERE Id = ? and user_id = ?'
  const connect = global.connection()
  connect.query(sql, params, (err, result) => {
    if (err) return
    res.json({ code: 200, message: 'success', data: {} })
    connect.end()
  })
})

app.post('/getHourseDetail', (req, res) => {
  var row = req.body
  var sql = 'SELECT * FROM hourse WHERE id = ? and user_id = ?'
  const connect = global.connection()
  connect.query(sql, [row.id, req.user.id], (err, result) => {
    if (err) return
    const data = result.map(item => ({
      ...item,
      desc: item.descd,
      step: JSON.parse(item.stepd),
      materials: JSON.parse(item.materials)
    }))
    res.json({ code: 200, message: 'success', data: data[0] || {} })
    connect.end()
  })
})

module.exports = app