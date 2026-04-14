const  express = require('express')
const app = express.Router()
const global = require('../../global.js')

// ? debt_list
app.get('/debt/list', (req, res) => {
  console.log("in")
  const connect = global.connection()
  const sql = `SELECT * FROM debt ORDER BY createTime DESC, id DESC`
  connect.query(sql, [], (err, data) => {
    if (err) {
      console.log(err)
    }
    res.json({
      code: 200,
      message: 'success',
      data: data
    })
    connect.end()
  })
})
// ? debt record
app.get('/debt/record/list', (req, res) => {
  const connect = global.connection()
  const sql = `select * from debt_rerd where debt_id = ?`
  connect.query(sql, [req.query.debt_id], (err, data) => {
    if (err) {
      console.log(err)
    }
    res.json({
      code: 200,
      message: 'success',
      data: data.reverse()
    })
    connect.end()
  })
})
app.post('/debt/record/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.name, query.amount,query.createTime, query.debtId]
  const sql = 'insert into debt_rerd (id,name,amount,createTime, debt_id) values(0,?,?,?,?)'
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
app.post('/debt/record/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete  from debt_rerd where id=' + query.id
  connect.query(sql, (err, data) => {
    if (err) return
    res.json({
      code: 200,
      data: data,
      message:'success'
    })
    connect.end()
  })
})

// ? app ()
app.post('/debt/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.name, query.amount, query.remain_amount,query.desc,query.createTime,query.endTime]
  const sql = 'insert into debt (id,name,amount,remain_amount,descd,createTime,endTime) values(0,?,?,?,?,?,?)'
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    res.json({
      code: 200,
      data: data,
      message: 'success'
    })
    console.log("you are so handsome")
    connect.end()
  })
})

app.post('/debt/edit', (req,res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.name, query.amount, query.remain_amount,query.desc,query.createTime,query.endTime]
  const sql = 'update debt set  name =?,amount = ?,remain_amount= ?,descd= ?,createTime= ?,endTime=  ? where id =' + req.body.id
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    res.json({
      code: 200,
      data: data,
      message: 'success'
    })
    console.log("just do it")
    connect.end()
  })
})

app.post('/debt/detail', (req, res) => {
  const connect = global.connection();
  const query = req.body
  const sql = 'select * from debt where id ='+ query.id
  connect.query(sql, (err, data) => {
    console.log(data)
    if (err) return
    res.json({
      code: 200,
      data: data[0],
      message: 'success'
    })
    connect.end()
  })
})

app.post('/debt/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete  from debt where id=' + query.id
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