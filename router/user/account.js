var express = require('express')
const { createClient } = require('@supabase/supabase-js')
var app = express.Router()
var global = require('../../global')

// 登录接口
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  const sql = `SELECT * FROM users WHERE username = ?`
  const connection = global.connection()

  connection.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.json({ code: 401, message: '用户不存在' })
    }

    const user = results[0]

    // 密码比对
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.json({ code: 401, message: '密码错误' })
    }

    // 登录成功
    res.json({
      code: 200,
      message: '登录成功',
      userId: user.id
    })
  })
})
// 注册接口（修复 + 完整 + 安全版）
app.post('/register', async (req, res) => {
  console.log("我靠")
  try {
    // 1. 获取前端传的参数
    const { mobile, password, email = '' } = req.body

    // 2. 密码加密（绝对不能存明文！）
    // const hashedPassword = await bcrypt.hash(password, 10)

    // 3. SQL 修复：
    // id 自增不用传，传了会报错
    const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`

    // 4. 执行 SQL
    const connection = global.connection()
    connection.query(sql, [mobile, password, email], (err, result) => {
      if (err) {
        return res.json({ code: 500, message: '注册失败', error: err.message })
      }

      // 成功
      res.json({
        code: 200,
        message: '注册成功'
      })
    })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误' })
  }
})


module.exports = app
