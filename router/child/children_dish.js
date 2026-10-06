var express = require('express')
var global = require('../../global.js')
var app = express.Router()

app.get('/getChildrenDish', (req, res) => {
  var params = [req.user.id, (parseInt(req.query.current || 1) - 1) * parseInt(req.query.size || 20), parseInt(req.query.size || 20)]
  var sql = 'select * from children_dish where user_id = ? limit ?,?'
  var aqlTotal = 'select count(*) as total from children_dish where user_id = ?'
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

app.post('/addChildrenDish', (req, res) => {
  var row = req.body
  var params = [row.name, row.detail, row.desc, JSON.stringify(row.step), JSON.stringify(row.materials), row.type, req.user.id]
  var sql = 'INSERT INTO children_dish(Id,name,detail,descd,stepd,materials,type,user_id) VALUES(0,?,?,?,?,?,?,?)'
  const connect = global.connection()
  connect.query(sql, params, (err, reStorey) => {
    if (err) return
    res.json({ code: 200, message: 'success', data: { query: res.query } })
    connect.end()
  })
})

app.post('/deleteChildrenDish', (req, res) => {
  var row = req.body
  var sql = 'DELETE FROM children_dish where id = ? and user_id = ?'
  const connect = global.connection()
  connect.query(sql, [row.id, req.user.id], (err, result) => {
    if (err) return
    res.json({ code: 200, message: 'success', data: { query: res.query } })
    connect.end()
  })
})

app.post('/editChildrenDish', (req, res) => {
  var row = req.body
  var params = [row.name, row.detail, row.desc, JSON.stringify(row.step), JSON.stringify(row.materials), row.type, row.id, req.user.id]
  var sql = 'UPDATE children_dish SET name = ?, detail = ?, descd = ?, stepd = ?, materials = ?, type = ? WHERE Id = ? and user_id = ?'
  const connect = global.connection()
  connect.query(sql, params, (err, result) => {
    if (err) return
    res.json({ code: 200, message: 'success', data: {} })
    connect.end()
  })
})

app.post('/getChildrenDishDetail', (req, res) => {
  var row = req.body
  var sql = 'SELECT * FROM children_dish WHERE id = ? and user_id = ?'
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