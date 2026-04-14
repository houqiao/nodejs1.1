const { Pool } = require('pg');

var host = process.env.SUPABASE_DB_HOST || process.env.PGHOST || 'db.mvotmnorojrhycecthcn.supabase.co'
var user = process.env.SUPABASE_DB_USER || process.env.PGUSER || 'postgres'
var password = process.env.SUPABASE_DB_PASSWORD || process.env.PGPASSWORD || 'houBIAO123456!'
var port = process.env.SUPABASE_DB_PORT || process.env.PGPORT || '5432'
var database = process.env.SUPABASE_DB_NAME || process.env.PGDATABASE || 'postgres'
var sslEnabled = (process.env.SUPABASE_DB_SSL || 'true') !== 'false'

var pool = new Pool({
  host: 'aws-1-ap-northeast-2.pooler.supabase.com',
  user: 'postgres.mvotmnorojrhycecthcn',
  password: 'houBIAO123456!',
  port: '6543',
  database: 'postgres',
  ssl:  { rejectUnauthorized: false }
});

var normalizeLimitOffsetSql = (sql, params) => {
  if (!Array.isArray(params) || params.length < 2) {
    return { sql, params }
  }

  var normalizedSql = sql.replace(/limit\s+\?\s*,\s*\?/ig, 'LIMIT ? OFFSET ?')

  if (normalizedSql === sql) {
    return { sql, params }
  }

  var limitMatch = sql.match(/limit\s+\?\s*,\s*\?/i)
  if (!limitMatch) {
    return { sql, params }
  }

  var beforeLimit = sql.slice(0, limitMatch.index)
  var placeholdersBeforeLimit = (beforeLimit.match(/\?/g) || []).length
  var offsetIndex = placeholdersBeforeLimit
  var limitIndex = placeholdersBeforeLimit + 1
  var nextParams = params.slice()
  var offsetValue = nextParams[offsetIndex]
  var limitValue = nextParams[limitIndex]

  nextParams[offsetIndex] = limitValue
  nextParams[limitIndex] = offsetValue

  return {
    sql: normalizedSql,
    params: nextParams
  }
}

var stripMysqlQuotes = (sql) => sql.replace(/`/g, '')

var normalizeInsertIdSql = (sql) => {
  return sql.replace(
    /insert\s+into\s+([a-zA-Z0-9_]+)\s*\(\s*(id)\s*,\s*([^)]+?)\)\s*values\s*\(\s*0\s*,\s*([^)]+?)\)/ig,
    function (_, tableName, idColumn, columns, values) {
      return `INSERT INTO ${tableName} (${columns}) VALUES (${values})`
    }
  )
}

var toPgSql = (sql, params) => {
  var mysqlCompatibleSql = normalizeInsertIdSql(stripMysqlQuotes(sql))
  var normalized = normalizeLimitOffsetSql(mysqlCompatibleSql, params)
  var index = 0
  var text = normalized.sql.replace(/\?/g, function () {
    index += 1
    return '$' + index
  })

  return {
    text: text,
    values: normalized.params || []
  }
}

// ! connection sql
var connection  = () => {
  return {
    query: function (sql, params, callback) {
      if (typeof params === 'function') {
        callback = params
        params = []
      }

      var queryConfig = toPgSql(sql, params || [])
      var command = (queryConfig.text.trim().match(/^[a-z]+/i) || [''])[0].toUpperCase()

      if (command === 'INSERT' && !/\bRETURNING\b/i.test(queryConfig.text)) {
        queryConfig.text += ' RETURNING id'
      }

      pool.query(queryConfig.text, queryConfig.values, function (err, result) {
        if (callback) {
          if (err) {
            callback(err, null, result)
            return
          }

          if (command === 'SELECT') {
            callback(null, result ? result.rows : null, result)
            return
          }

          callback(null, {
            affectedRows: result ? result.rowCount : 0,
            changedRows: result ? result.rowCount : 0,
            insertId: result && result.rows && result.rows[0] ? result.rows[0].id : undefined,
            rows: result ? result.rows : []
          }, result)
        }
      })
    },
    connect: function (callback) {
      if (callback) {
        callback(null)
      }
    },
    end: function () {
      return Promise.resolve()
    }
  }
}

// ! app res  
var  resJson = (err, res, data, callback) => {
  if (err) {
    console.log('---', err)
  }
  if (callback) {
    callback()
  } else {
    res.json({
      code: 200,
      message: 'success',
      data: data || null
    })
  }
}

// ! app use router
var forUseRouter = (list, app) => {
  for (var key in list) {
    app.use('/api', list[key])
  }
}

// sql detail
var sqlDetail = (name, id) => `select * from ${name} where id=${id}`
// sql list
var sqlList = (name) => `select * from ${name} limit ?,?`
// sql delete
var sqlDelete = (name, id) => `delete from ${name} where id = ${id}`

module.exports = {
  connection,
  resJson,
  forUseRouter,
  sqlDetail,
  sqlList,
  sqlDelete,
}
