var express = require('express')
var app = express.Router()
var global = require('../../global')

app.get('/loan/list', (req, res) => {
  const connect = global.connection()
  const query = req.query
  let sql = 'select * from mortgage_loan where user_id = ? '
  const param = [req.user.id]

  if (query.bankName) {
    sql += 'and bankName LIKE ? '
    param.push(`%${query.bankName}%`)
  }
  if (query.loanType) {
    sql += 'and loanType = ? '
    param.push(query.loanType)
  }
  if (query.status) {
    sql += 'and status = ? '
    param.push(query.status)
  }

  sql += 'ORDER BY id DESC limit ? offset ?'
  param.push(parseInt(query.size || 20), (parseInt(query.current || 1) - 1) * parseInt(query.size || 20))

  connect.query(sql, param, (err, data) => {
    if (err) return
    connect.query('select count(*) as total from mortgage_loan where user_id = ?', [req.user.id], (err, datatotal) => {
      res.json({ code: 200, data: { records: data, total: datatotal[0].total || 0 }, message: 'success', success: true })
      connect.end()
    })
  })
})

app.post('/loan/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.bankName, query.loanAmount, query.loanTerm, query.interestRate, query.monthlyPayment, query.remainingAmount, query.loanType, query.startDate, query.endDate, query.status || 'active', query.description, req.user.id]
  const sql = 'insert into mortgage_loan (id,bankName,loanAmount,loanTerm,interestRate,monthlyPayment,remainingAmount,loanType,"startDate","endDate",status,description,user_id) values(0,?,?,?,?,?,?,?,?,?,?,?,?)'

  connect.query(sql, param, (err, data) => {
    if (err) {
      res.json({ code: 500, message: '添加失败', success: false })
      connect.end()
      return
    }
    res.json({ code: 200, data: data, message: 'success', success: true })
    connect.end()
  })
})

app.post('/loan/edit', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const id = query.id || req.query.id
  const param = [query.bankName, query.loanAmount, query.loanTerm, query.interestRate, query.monthlyPayment, query.remainingAmount, query.loanType, query.startDate, query.endDate, query.status, query.description, id, req.user.id]
  const sql = 'update mortgage_loan set bankName = ?, loanAmount = ?, loanTerm = ?, interestRate = ?, monthlyPayment = ?, remainingAmount = ?, loanType = ?, "startDate" = ?, "endDate" = ?, status = ?, description = ? where id = ? and user_id = ?'

  connect.query(sql, param, (err, data) => {
    if (err) {
      res.json({ code: 500, message: '更新失败', success: false })
      connect.end()
      return
    }
    res.json({ code: 200, data: data, message: 'success', success: true })
    connect.end()
  })
})

app.post('/loan/detail', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'select * from mortgage_loan where id = ? and user_id = ?'

  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) {
      res.json({ code: 500, message: '查询失败', success: false })
      connect.end()
      return
    }
    res.json({ code: 200, data: data[0], message: 'success', success: true })
    connect.end()
  })
})

app.post('/loan/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete from mortgage_loan where id = ? and user_id = ?'

  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) {
      res.json({ code: 500, message: '删除失败', success: false })
      connect.end()
      return
    }
    res.json({ code: 200, data: data, message: 'success', success: true })
    connect.end()
  })
})

app.get('/loan/prepayment/list', (req, res) => {
  const connect = global.connection()
  const query = req.query
  let sql = 'select p.*, m.bankName, m.loanAmount as totalLoanAmount from mortgage_prepayment p left join mortgage_loan m on p.loanId = m.id and m.user_id = ? where p.user_id = ? '
  const param = [req.user.id, req.user.id]

  if (query.loanId) {
    sql += 'and p.loanId = ? '
    param.push(query.loanId)
  }
  if (query.paymentType) {
    sql += 'and p.paymentType = ? '
    param.push(query.paymentType)
  }
  if (query.startDate && query.endDate) {
    sql += 'and p."paymentDate" BETWEEN ? AND ? '
    param.push(query.startDate, query.endDate)
  }

  sql += 'ORDER BY p.id DESC limit ? offset ?'
  param.push(parseInt(query.size || 20), (parseInt(query.current || 1) - 1) * parseInt(query.size || 20))

  connect.query(sql, param, (err, data) => {
    if (err) return
    connect.query('select count(*) as total from mortgage_prepayment where user_id = ?', [req.user.id], (err, datatotal) => {
      res.json({ code: 200, data: { records: data, total: datatotal[0].total || 0 }, message: 'success', success: true })
      connect.end()
    })
  })
})

app.post('/loan/prepayment/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [query.loanId, query.paymentAmount, query.paymentDate, query.paymentType || 'partial', query.remainingAfterPayment, query.interestSaved, query.termReduced, query.description, req.user.id]
  const sql = 'insert into mortgage_prepayment (id,"loanId","paymentAmount","paymentDate","paymentType","remainingAfterPayment","interestSaved","termReduced","description",user_id) values(0,?,?,?,?,?,?,?,?,?)'

  connect.query(sql, param, (err, data) => {
    if (err) {
      res.json({ code: 500, message: '添加失败', success: false })
      connect.end()
      return
    }

    if (query.remainingAfterPayment !== undefined) {
      const updateSql = 'update mortgage_loan set remainingAmount = ? where id = ? and user_id = ?'
      connect.query(updateSql, [query.remainingAfterPayment, query.loanId, req.user.id], (updateErr) => {
        if (updateErr) console.log('更新房贷剩余金额失败:', updateErr)
      })
    }

    res.json({ code: 200, data: data, message: 'success', success: true })
    connect.end()
  })
})

app.post('/loan/prepayment/edit', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const id = query.id || req.query.id
  const param = [query.loanId, query.paymentAmount, query.paymentDate, query.paymentType, query.remainingAfterPayment, query.interestSaved, query.termReduced, query.description, id, req.user.id]
  const sql = 'update mortgage_prepayment set "loanId" = ?, "paymentAmount" = ?, "paymentDate" = ?, "paymentType" = ?, "remainingAfterPayment" = ?, "interestSaved" = ?, "termReduced" = ?, description = ? where id = ? and user_id = ?'

  connect.query(sql, param, (err, data) => {
    if (err) {
      res.json({ code: 500, message: '更新失败', success: false })
      connect.end()
      return
    }
    res.json({ code: 200, data: data, message: 'success', success: true })
    connect.end()
  })
})

app.post('/loan/prepayment/detail', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'select p.*, m.bankName, m.loanAmount as totalLoanAmount from mortgage_prepayment p left join mortgage_loan m on p.loanId = m.id and m.user_id = ? where p.id = ? and p.user_id = ?'

  connect.query(sql, [req.user.id, query.id, req.user.id], (err, data) => {
    if (err) {
      res.json({ code: 500, message: '查询失败', success: false })
      connect.end()
      return
    }
    res.json({ code: 200, data: data[0], message: 'success', success: true })
    connect.end()
  })
})

app.post('/loan/prepayment/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete from mortgage_prepayment where id = ? and user_id = ?'

  connect.query(sql, [query.id, req.user.id], (err, data) => {
    if (err) {
      res.json({ code: 500, message: '删除失败', success: false })
      connect.end()
      return
    }
    res.json({ code: 200, data: data, message: 'success', success: true })
    connect.end()
  })
})

app.get('/loan/statistics', (req, res) => {
  const connect = global.connection()
  const query = req.query

  let sql = `
    SELECT
      COUNT(*) as totalLoans,
      SUM(loanAmount) as totalLoanAmount,
      SUM(remainingAmount) as totalRemainingAmount,
      AVG(interestRate) as avgInterestRate,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeLoans,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedLoans
    FROM mortgage_loan
    WHERE user_id = ?
  `

  const param = [req.user.id]
  if (query.status) {
    sql += ' AND status = ?'
    param.push(query.status)
  }

  connect.query(sql, param, (err, loanStats) => {
    if (err) {
      res.json({ code: 500, message: '查询失败', success: false })
      connect.end()
      return
    }

    const prepaymentSql = `
      SELECT
        COUNT(*) as totalPrepayments,
        SUM(paymentAmount) as totalPrepaymentAmount,
        SUM(interestSaved) as totalInterestSaved
      FROM mortgage_prepayment
      WHERE user_id = ?
    `

    connect.query(prepaymentSql, [req.user.id], (err, prepaymentStats) => {
      if (err) {
        res.json({ code: 500, message: '查询失败', success: false })
        connect.end()
        return
      }

      res.json({ code: 200, data: { loanStatistics: loanStats[0], prepaymentStatistics: prepaymentStats[0] }, message: 'success', success: true })
      connect.end()
    })
  })
})

module.exports = app