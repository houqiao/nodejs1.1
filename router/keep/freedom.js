var express = require('express')
var app = express.Router()
var global = require('../../global')

// 获取旅行基金列表
app.get('/freedom/list', (req, res) => {
  const connect = global.connection()
  const query = req.query
  let sql = `select * from travel_fund`
  const param = []
  
  if (query.title) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} title LIKE '%${query.title}%' `
  }
  if (query.year) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} year = ? `
    param.push(query.year)
  }
  if (query.completed !== undefined) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} completed = ? `
    param.push(query.completed)
  }
  
  sql = sql + ` ORDER BY id DESC `
  sql = sql + `limit ${parseInt(query.size || 20)} offset ${(parseInt(query.current || 1) - 1) * parseInt(query.size || 20)}`
  
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    connect.query('select count(*) as total from travel_fund', (err, datatotal) => {
      res.json({
        code: 200,
        data: {
          records: data,
          total: datatotal[0].total || 0
        },
        message: 'success',
        success: true
        })
        connect.end()
    })
  })
})  

// 添加旅行基金
app.post('/freedom/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.year, query.title, query.targetAmount, query.currentAmount, query.description, query.completed || false, query.completedDate]
  const sql = 'insert into travel_fund (id,"year","title","targetAmount","currentAmount","description","completed","completedDate") values(0,?,?,?,?,?,?,?)'
  
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log(err)
      res.json({
        code: 500,
        message: '添加失败',
        success: false
      })
    }
    res.json({
      code: 200,
      data: data,
      message: 'success',
      success: true
    })
    connect.end()
  })
})

// 编辑旅行基金
app.post('/freedom/edit', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.year, query.title, query.targetAmount, query.currentAmount, query.description, query.completed || false, query.completedDate]
  const sql = 'update travel_fund set "year" = ?, "title" = ?, "targetAmount" = ?, "currentAmount" = ?, "description" = ?, "completed" = ?, "completedDate" = ? where id =' + query.id
  
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    res.json({
      code: 200,
      data: data,
      message: 'success',
      success: true
    })
    connect.end()
  })
})

// 获取旅行基金详情
app.post('/freedom/detail', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'select * from travel_fund where id =' + query.id
  
  connect.query(sql, (err, data) => {
    if (err) return
    res.json({
      code: 200,
      data: data[0],
      message: 'success',
      success: true   
    })
    connect.end()
  })
})

// 删除旅行基金
app.post('/freedom/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete from travel_fund where id=' + query.id
  
  connect.query(sql, (err, data) => {
    if (err) return
    res.json({
      code: 200,
      data: data,
      message: 'success',
      success: true 
    })
    connect.end()
  })
})

module.exports = app