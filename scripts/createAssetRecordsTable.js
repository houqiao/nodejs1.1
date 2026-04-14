const { connection: createConnection } = require('../global');

const SQL = `
  CREATE TABLE IF NOT EXISTS asset_records (
    id BIGSERIAL PRIMARY KEY,
    amount NUMERIC(15,2) NOT NULL,
    description VARCHAR(255) NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL DEFAULT 'general',
    record_date DATE NOT NULL,
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_asset_records_record_date ON asset_records (record_date);
  CREATE INDEX IF NOT EXISTS idx_asset_records_category ON asset_records (category);
  CREATE INDEX IF NOT EXISTS idx_asset_records_record_date_category ON asset_records (record_date, category);
`;

function ensureAssetRecordsTable() {
  const conn = createConnection();

  conn.query(SQL, err => {
    if (err) {
      console.error('创建 asset_records 表失败:', err);
      conn.end();
      process.exitCode = 1;
      return;
    }

    console.log('asset_records 表已创建或已存在');
    conn.end();
  });
}

ensureAssetRecordsTable();
