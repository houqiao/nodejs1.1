const  express = require('express')
const app = express.Router()
const global = require('../../global.js')

// ? debt_list
app.get('/big/list', (req, res) => {
  console.log("in")
  const connect = global.connection()
  const sql = `select * from t_sell_area`
  connect.query(sql, (err, data) => {
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
module.exports = app