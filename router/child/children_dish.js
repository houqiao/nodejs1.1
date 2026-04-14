var express = require('express');
var global = require('../../global.js');
// var ObjectID = require('mongdb').ObjectID; // 查询ID模块
var app = express.Router();
console.log(global)
app.get('/getChildrenDish', (req, res) => {
  var params = [(parseInt(req.query.current || 1) - 1) * parseInt(req.query.size || 20), parseInt(req.query.size || 20)]
  var sql = "select * from children_dish limit ?,?";
  var aqlTotal = 'select count(*) as total from children_dish'
  const connect = global.connection()
  let data = []
  connect.query(sql, params, (err, resAll) => {
    console.log('--', resAll)
    if (err) return
    data = resAll.map(item => {
      return {
        ...item,
        desc: item.descd, 
        step: JSON.parse(item.stepd),
        materials: JSON.parse(item.materials)
      }
    })
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
app.post('/addChildrenDish', (req, res) => {
  var row = req.body
  var params = [row.name, row.detail, row.desc, JSON.stringify(row.step), JSON.stringify(row.materials), row.type]
  var sql = 'INSERT INTO children_dish(Id,name,detail,descd,stepd,materials,type) VALUES(0,?,?,?,?,?,?)';
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
app.post('/deleteChildrenDish', (req, res) => {
  var row = req.body
  var sql = 'DELETE FROM  `children_dish` where id=' + row.id
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
app.post('/editChildrenDish', (req, res) => {
  var row = req.body
  var params = [row.name, row.detail, row.desc, JSON.stringify(row.step), JSON.stringify(row.materials), row.type, row.id]
  var sql = 'UPDATE children_dish SET name = ?, detail = ?, descd = ?, stepd = ?, materials = ?, type = ?  WHERE Id = ?'
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
app.post('/getChildrenDishDetail', (req, res) => {
  var row  = req.body
  var  sql = 'SELECT * FROM `children_dish` WHERE id = ' + row.id
  const connect = global.connection()
  connect.query(sql, (err, result) => {
    console.log('----', result)
    if (err) return
    data = result.map(item => {
      return {
        ...item,
        desc: item.descd, 
        step: JSON.parse(item.stepd),
        materials: JSON.parse(item.materials)
      }
    })
    res.json({
      code: 200,
      message: 'success',
      data: data[0] || {}
    })
    connect.end()
  })
}),
module.exports = app;
