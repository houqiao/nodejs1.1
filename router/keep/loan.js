var express = require('express')
var app = express.Router()
var global = require('../../global')

// ==================== 房贷管理接口 ====================

// 获取房贷列表
app.get('/loan/list', (req, res) => {
  const connect = global.connection()
  const query = req.query
  let sql = `select * from mortgage_loan `
  const param = []
  
  if (query.bankName) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} bankName LIKE '%${query.bankName}%' `
  }
  if (query.loanType) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} loanType = ? `
    param.push(query.loanType)
  }
  if (query.status) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} status = ? `
    param.push(query.status)
  }
  
  sql = sql + ` ORDER BY id DESC `
  sql = sql + `limit ${parseInt(query.size || 20)} offset ${(parseInt(query.current || 1) - 1) * parseInt(query.size || 20)}`
  
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    connect.query('select count(*) as total from mortgage_loan', (err, datatotal) => {
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

// 添加房贷
app.post('/loan/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [
    query.bankName, 
    query.loanAmount, 
    query.loanTerm, 
    query.interestRate, 
    query.monthlyPayment, 
    query.remainingAmount, 
    query.loanType, 
    query.startDate, 
    query.endDate, 
    query.status || 'active',
    query.description
  ]
  const sql = 'insert into mortgage_loan (id,bankName,loanAmount,loanTerm,interestRate,monthlyPayment,remainingAmount,loanType,"startDate","endDate",status,description) values(0,?,?,?,?,?,?,?,?,?,?,?)'
  
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log(err)
      res.json({
        code: 500,
        message: '添加失败',
        success: false
      })
      connect.end()
      return
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

// 编辑房贷
app.post('/loan/edit', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [
    query.bankName, 
    query.loanAmount, 
    query.loanTerm, 
    query.interestRate, 
    query.monthlyPayment, 
    query.remainingAmount, 
    query.loanType, 
    query.startDate, 
    query.endDate, 
    query.status,
    query.description
  ]
  const sql = 'update mortgage_loan set bankName =?, loanAmount = ?, loanTerm = ?, interestRate = ?, monthlyPayment = ?, remainingAmount = ?, loanType = ?, "startDate" = ?, "endDate" = ?, status = ?, description = ? where id =' + req.query.id
  
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) {
      res.json({
        code: 500,
        message: '更新失败',
        success: false
      })
      connect.end()
      return
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

// 获取房贷详情
app.post('/loan/detail', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'select * from mortgage_loan where id =' + query.id
  
  connect.query(sql, (err, data) => {
    if (err) {
      res.json({
        code: 500,
        message: '查询失败',
        success: false
      })
      connect.end()
      return
    }
    res.json({
      code: 200,
      data: data[0],
      message: 'success',
      success: true
    })
    connect.end()
  })
})

// 删除房贷
app.post('/loan/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete from mortgage_loan where id=' + query.id
  
  connect.query(sql, (err, data) => {
    if (err) {
      res.json({
        code: 500,
        message: '删除失败',
        success: false
      })
      connect.end()
      return
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

// ==================== 房贷提前还款接口 ====================

// 获取提前还款记录列表
app.get('/loan/prepayment/list', (req, res) => {
  const connect = global.connection()
  const query = req.query
  let sql = `select p.*, m.bankName, m.loanAmount as totalLoanAmount from mortgage_prepayment p left join mortgage_loan m on p.loanId = m.id `
  const param = []
  
  if (query.loanId) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} p.loanId = ? `
    param.push(query.loanId)
  }
  if (query.paymentType) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} p.paymentType = ? `
    param.push(query.paymentType)
  }
  if (query.startDate && query.endDate) {
    sql = sql + `${sql.includes('where') ? 'and' : 'where'} p."paymentDate" BETWEEN ? AND ? `
    param.push(query.startDate, query.endDate)
  }
  
  sql = sql + ` ORDER BY p.id DESC `
  sql = sql + `limit ${parseInt(query.size || 20)} offset ${(parseInt(query.current || 1) - 1) * parseInt(query.size || 20)}`
  
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) return
    connect.query('select count(*) as total from mortgage_prepayment', (err, datatotal) => {
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

// 添加提前还款记录
app.post('/loan/prepayment/add', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [
    query.loanId,
    query.paymentAmount,
    query.paymentDate,
    query.paymentType || 'partial', // partial: 部分还款, full: 全额还款
    query.remainingAfterPayment,
    query.interestSaved,
    query.termReduced,
    query.description
  ]
  const sql = 'insert into mortgage_prepayment (id,"loanId","paymentAmount","paymentDate","paymentType","remainingAfterPayment","interestSaved","termReduced","description") values(0,?,?,?,?,?,?,?,?)'
  
  connect.query(sql, param, (err, data) => {
    if (err) {
      console.log(err)
      res.json({
        code: 500,
        message: '添加失败',
        success: false
      })
      connect.end()
      return
    }
    
    // 更新房贷剩余金额
    if (query.remainingAfterPayment !== undefined) {
      const updateSql = 'update mortgage_loan set remainingAmount = ? where id = ?'
      connect.query(updateSql, [query.remainingAfterPayment, query.loanId], (updateErr) => {
        if (updateErr) console.log('更新房贷剩余金额失败:', updateErr)
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

// 编辑提前还款记录
app.post('/loan/prepayment/edit', (req, res) => {
  const connect = global.connection()
  const query = req.body
  const param = [
    query.loanId,
    query.paymentAmount,
    query.paymentDate,
    query.paymentType,
    query.remainingAfterPayment,
    query.interestSaved,
    query.termReduced,
    query.description
  ]
  const sql = 'update mortgage_prepayment set "loanId" = ?, "paymentAmount" = ?, "paymentDate" = ?, "paymentType" = ?, "remainingAfterPayment" = ?, "interestSaved" = ?, "termReduced" = ?, description = ? where id =' + req.query.id
  
  connect.query(sql, param, (err, data) => {
    console.log(err)
    if (err) {
      res.json({
        code: 500,
        message: '更新失败',
        success: false
      })
      connect.end()
      return
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

// 获取提前还款记录详情
app.post('/loan/prepayment/detail', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'select p.*, m.bankName, m.loanAmount as totalLoanAmount from mortgage_prepayment p left join mortgage_loan m on p.loanId = m.id where p.id =' + query.id
  
  connect.query(sql, (err, data) => {
    if (err) {
      res.json({
        code: 500,
        message: '查询失败',
        success: false
      })
      connect.end()
      return
    }
    res.json({
      code: 200,
      data: data[0],
      message: 'success',
      success: true
    })
    connect.end()
  })
})

// 删除提前还款记录
app.post('/loan/prepayment/delete', (req, res) => {
  const connect = global.connection()
  const query = req.query
  const sql = 'delete from mortgage_prepayment where id=' + query.id
  
  connect.query(sql, (err, data) => {
    if (err) {
      res.json({
        code: 500,
        message: '删除失败',
        success: false
      })
      connect.end()
      return
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

// 获取房贷统计信息
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
  `
  
  const param = []
  if (query.status) {
    sql += ' WHERE status = ?'
    param.push(query.status)
  }
  
  connect.query(sql, param, (err, loanStats) => {
    if (err) {
      res.json({
        code: 500,
        message: '查询失败',
        success: false
      })
      connect.end()
      return
    }
    
    // 查询提前还款统计
    const prepaymentSql = `
      SELECT 
        COUNT(*) as totalPrepayments,
        SUM(paymentAmount) as totalPrepaymentAmount,
        SUM(interestSaved) as totalInterestSaved
      FROM mortgage_prepayment
    `
    
    connect.query(prepaymentSql, (err, prepaymentStats) => {
      if (err) {
        res.json({
          code: 500,
          message: '查询失败',
          success: false
        })
        connect.end()
        return
      }
      
      res.json({
        code: 200,
        data: {
          loanStatistics: loanStats[0],
          prepaymentStatistics: prepaymentStats[0]
        },
        message: 'success',
        success: true
      })
      connect.end()
    })
  })
})

module.exports = app