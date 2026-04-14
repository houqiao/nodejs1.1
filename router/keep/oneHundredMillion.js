const express = require('express');
const router = express.Router();
const global = require('../../global');

const DEFAULT_LIMITS = {
  daily: 30,
  weekly: 12,
  monthly: 12,
  yearly: 5,
  list: 20
};

const chartConfig = {
  daily: {
    labelSelect: 'record_date',
    groupBy: ['record_date'],
    orderBy: 'record_date DESC'
  },
  weekly: {
    labelSelect:
      "TO_CHAR(DATE_TRUNC('week', record_date::timestamp)::date, 'MM/DD') || '-' || " +
      "TO_CHAR((DATE_TRUNC('week', record_date::timestamp)::date + INTERVAL '6 day')::date, 'MM/DD')",
    groupBy: [
      "DATE_TRUNC('week', record_date::timestamp)::date",
      "TO_CHAR(DATE_TRUNC('week', record_date::timestamp)::date, 'MM/DD') || '-' || TO_CHAR((DATE_TRUNC('week', record_date::timestamp)::date + INTERVAL '6 day')::date, 'MM/DD')"
    ],
    orderBy: "DATE_TRUNC('week', record_date::timestamp)::date DESC"
  },
  monthly: {
    labelSelect: `TO_CHAR(record_date, 'YYYY"年"MM"月"')`,
    groupBy: [
      "TO_CHAR(record_date, 'YYYY-MM')",
      `TO_CHAR(record_date, 'YYYY"年"MM"月"')`
    ],
    orderBy: `TO_CHAR(record_date, 'YYYY-MM') DESC`
  },
  yearly: {
    labelSelect: "EXTRACT(YEAR FROM record_date)::text || '年'",
    groupBy: [
      'EXTRACT(YEAR FROM record_date)',
      "EXTRACT(YEAR FROM record_date)::text || '年'"
    ],
    orderBy: 'EXTRACT(YEAR FROM record_date) DESC'
  }
};

function toPositiveInt(value, fallback) {
  const num = parseInt(value, 10);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function buildAssetFilters({ startDate, endDate, category }) {
  const conditions = ['1=1'];
  const params = [];

  if (startDate) {
    conditions.push('record_date >= ?');
    params.push(startDate);
  }
  if (endDate) {
    conditions.push('record_date <= ?');
    params.push(endDate);
  }
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  return {
    clause: ` WHERE ${conditions.join(' AND ')}`,
    params
  };
}

function sendSuccess(res, message, data) {
  res.json({
    code: 200,
    message,
    data: data ?? null,
    success: true
  });
}

function sendFailure(res, message, code = 500) {
  res.json({
    code,
    message,
    success: false
  });
}

// 添加当日资产金额
router.post('/asset/add', (req, res) => {
  const { amount, description = '', category = 'general' } = req.body || {};
  const numericAmount = toNumber(amount);

  if (numericAmount === null) {
    return sendFailure(res, '金额不能为空', 400);
  }

  const conn = global.connection();
  const sql =
    'INSERT INTO asset_records (amount, description, category, record_date, create_time) VALUES (?, ?, ?, CURRENT_DATE, NOW())';

  conn.query(sql, [numericAmount, description, category], (err, result) => {
    if (err) {
      console.error('添加资产记录失败:', err);
      sendFailure(res, '添加失败');
      conn.end();
      return;
    }

    sendSuccess(res, '添加成功', { id: result.insertId });
    conn.end();
  });
});

// 获取每日资产统计数据
router.get('/asset/daily', (req, res) => {
  const { startDate, endDate, limit } = req.query || {};
  const limitValue = toPositiveInt(limit, DEFAULT_LIMITS.daily);

  let sql = `
    SELECT
      record_date as date,
      SUM(amount) as total_amount,
      COUNT(*) as record_count,
      AVG(amount) as avg_amount
    FROM asset_records
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    sql += ' AND record_date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    sql += ' AND record_date <= ?';
    params.push(endDate);
  }

  sql += ' GROUP BY record_date ORDER BY record_date DESC LIMIT ?';
  params.push(limitValue);

  const conn = global.connection();
  conn.query(sql, params, (err, results) => {
    if (err) {
      console.error('获取每日统计失败:', err);
      sendFailure(res, '获取失败');
      conn.end();
      return;
    }

    sendSuccess(res, '获取成功', results);
    conn.end();
  });
});

// 获取每周资产统计数据
router.get('/asset/weekly', (req, res) => {
  const { startDate, endDate, limit } = req.query || {};
  const limitValue = toPositiveInt(limit, DEFAULT_LIMITS.weekly);

  let sql = `
    SELECT
      TO_CHAR(DATE_TRUNC('week', record_date::timestamp), 'IYYY-IW') as week_key,
      DATE_TRUNC('week', record_date::timestamp)::date as week_start,
      (DATE_TRUNC('week', record_date::timestamp)::date + INTERVAL '6 day')::date as week_end,
      SUM(amount) as total_amount,
      COUNT(*) as record_count,
      AVG(amount) as avg_amount
    FROM asset_records
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    sql += ' AND record_date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    sql += ' AND record_date <= ?';
    params.push(endDate);
  }

  sql += `
    GROUP BY
      DATE_TRUNC('week', record_date::timestamp)
    ORDER BY DATE_TRUNC('week', record_date::timestamp) DESC
    LIMIT ?
  `;
  params.push(limitValue);

  const conn = global.connection();
  conn.query(sql, params, (err, results) => {
    if (err) {
      console.error('获取每周统计失败:', err);
      sendFailure(res, '获取失败');
      conn.end();
      return;
    }

    sendSuccess(res, '获取成功', results);
    conn.end();
  });
});

// 获取每月资产统计数据
router.get('/asset/monthly', (req, res) => {
  const { startDate, endDate, limit } = req.query || {};
  const limitValue = toPositiveInt(limit, DEFAULT_LIMITS.monthly);

  let sql = `
    SELECT
      TO_CHAR(record_date, 'YYYY-MM') as month,
      TO_CHAR(record_date, 'YYYY"年"MM"月"') as month_label,
      SUM(amount) as total_amount,
      COUNT(*) as record_count,
      AVG(amount) as avg_amount,
      MIN(amount) as min_amount,
      MAX(amount) as max_amount
    FROM asset_records
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    sql += ' AND record_date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    sql += ' AND record_date <= ?';
    params.push(endDate);
  }

  sql += `
    GROUP BY
      TO_CHAR(record_date, 'YYYY-MM'),
      TO_CHAR(record_date, 'YYYY"年"MM"月"')
    ORDER BY month DESC
    LIMIT ?
  `;
  params.push(limitValue);

  const conn = global.connection();
  conn.query(sql, params, (err, results) => {
    if (err) {
      console.error('获取每月统计失败:', err);
      sendFailure(res, '获取失败');
      conn.end();
      return;
    }

    sendSuccess(res, '获取成功', results);
    conn.end();
  });
});

// 获取每年资产统计数据
router.get('/asset/yearly', (req, res) => {
  const { startDate, endDate, limit } = req.query || {};
  const limitValue = toPositiveInt(limit, DEFAULT_LIMITS.yearly);

  let sql = `
    SELECT
      EXTRACT(YEAR FROM record_date) as year,
      EXTRACT(YEAR FROM record_date)::text || '年' as year_label,
      SUM(amount) as total_amount,
      COUNT(*) as record_count,
      AVG(amount) as avg_amount,
      MIN(amount) as min_amount,
      MAX(amount) as max_amount
    FROM asset_records
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    sql += ' AND record_date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    sql += ' AND record_date <= ?';
    params.push(endDate);
  }

  sql += ' GROUP BY EXTRACT(YEAR FROM record_date) ORDER BY year DESC LIMIT ?';
  params.push(limitValue);

  const conn = global.connection();
  conn.query(sql, params, (err, results) => {
    if (err) {
      console.error('获取每年统计失败:', err);
      sendFailure(res, '获取失败');
      conn.end();
      return;
    }

    sendSuccess(res, '获取成功', results);
    conn.end();
  });
});

// 获取柱状图数据格式化接口
router.get('/asset/chart/:type', (req, res) => {
  const { type } = req.params;
  const { startDate, endDate, limit, category } = req.query || {};

  if (!chartConfig[type]) {
    return sendFailure(res, '不支持的统计类型', 400);
  }

  const { labelSelect, groupBy, orderBy } = chartConfig[type];
  const limitValue = toPositiveInt(limit, DEFAULT_LIMITS[type] || DEFAULT_LIMITS.daily);
  const { clause, params } = buildAssetFilters({ startDate, endDate, category });

  let sql = `
    SELECT
      ${labelSelect} as label,
      SUM(amount) as value,
      COUNT(*) as count
    FROM asset_records${clause}
    GROUP BY ${groupBy.join(', ')}
    ORDER BY ${orderBy}
    LIMIT ?
  `;

  const conn = global.connection();
  conn.query(sql, [...params, limitValue], (err, results) => {
    if (err) {
      console.error('获取图表数据失败:', err);
      sendFailure(res, '获取失败');
      conn.end();
      return;
    }

    const summaryTotal = results.reduce((sum, item) => sum + toNumber(item.value || 0), 0);
    const summaryCount = results.reduce((sum, item) => sum + toPositiveInt(item.count, 0), 0);
    const average = results.length > 0 ? summaryTotal / results.length : 0;

    const chartData = {
      labels: results.map(item => item.label),
      datasets: [
        {
          label: '资产金额',
          data: results.map(item => toNumber(item.value) ?? 0),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ],
      summary: {
        total: summaryTotal,
        count: summaryCount,
        average
      }
    };

    sendSuccess(res, '获取成功', chartData);
    conn.end();
  });
});

// 获取资产记录列表
router.get('/asset/list', (req, res) => {
  const { page = 1, limit, startDate, endDate, category } = req.query || {};
  const pageValue = toPositiveInt(page, 1);
  const limitValue = toPositiveInt(limit, DEFAULT_LIMITS.list);
  const offset = (pageValue - 1) * limitValue;

  const { clause, params: filterParams } = buildAssetFilters({ startDate, endDate, category });
  const listSql = `
    SELECT *
    FROM asset_records${clause}
    ORDER BY record_date DESC, create_time DESC
    LIMIT ? OFFSET ?
  `;
  const listParams = [...filterParams, limitValue, offset];

  const conn = global.connection();
  conn.query(listSql, listParams, (err, results) => {
    if (err) {
      console.error('获取资产记录失败:', err);
      sendFailure(res, '获取失败');
      conn.end();
      return;
    }

    const countSql = `SELECT COUNT(*) as total FROM asset_records${clause}`;

    conn.query(countSql, filterParams, (countErr, countResults) => {
      if (countErr) {
        console.error('获取总数失败:', countErr);
        sendFailure(res, '获取失败');
        conn.end();
        return;
      }

      const total = Number(countResults[0]?.total || 0);
      sendSuccess(res, '获取成功1', {
        list: results,
        pagination: {
          page: pageValue,
          limit: limitValue,
          total,
          totalPages: Math.ceil(total / limitValue) || 1
        }
      });
      conn.end();
    });
  });
});

// 删除资产记录
router.post('/asset/delete', (req, res) => {
  const { id } = req.body || {};

  if (!id) {
    return sendFailure(res, 'ID不能为空', 400);
  }

  const conn = global.connection();
  const sql = 'DELETE FROM asset_records WHERE id = ?';

  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error('删除资产记录失败:', err);
      sendFailure(res, '删除失败');
      conn.end();
      return;
    }

    if (result.affectedRows === 0) {
      sendFailure(res, '记录不存在', 404);
      conn.end();
      return;
    }

    sendSuccess(res, '删除成功');
    conn.end();
  });
});

// 编辑资产记录
router.post('/asset/edit', (req, res) => {
  const { id, amount, description, category, record_date } = req.body || {};

  if (!id) {
    return sendFailure(res, 'ID不能为空', 400);
  }

  const updates = [];
  const params = [];

  if (amount !== undefined) {
    const numericAmount = toNumber(amount);
    if (numericAmount === null) {
      return sendFailure(res, '金额格式不正确', 400);
    }
    updates.push('amount = ?');
    params.push(numericAmount);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (category !== undefined) {
    updates.push('category = ?');
    params.push(category);
  }
  if (record_date !== undefined) {
    updates.push('record_date = ?');
    params.push(record_date);
  }

  if (updates.length === 0) {
    return sendFailure(res, '没有要更新的字段', 400);
  }

  updates.push('update_time = NOW()');
  params.push(id);

  const sql = `UPDATE asset_records SET ${updates.join(', ')} WHERE id = ?`;
  const conn = global.connection();

  conn.query(sql, params, (err, result) => {
    if (err) {
      console.error('编辑资产记录失败:', err);
      sendFailure(res, '编辑失败');
      conn.end();
      return;
    }

    if (result.affectedRows === 0) {
      sendFailure(res, '记录不存在', 404);
      conn.end();
      return;
    }

    sendSuccess(res, '编辑成功');
    conn.end();
  });
});

module.exports = router;
