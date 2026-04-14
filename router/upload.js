var express = require('express')
// var global = require('./global')
const multer = require('multer')
const path = require('path');
var app = express.Router()

const storage = multer.diskStorage({
  // ? save route
  destination: function (req, file, cb) {
    cb(null, './static/uploads')
  },
  filename: function(req, file, cb) {
		// 拿到文件名
		const tmp = path.extname(file.originalname);
		// 根据文件时间、随机数、后缀名生成新的文件名
		const date = `${new Date().getTime()}`;
		const random = `${Math.random().toString().slice(2)}`;
		const file_name = `avatar_${date}-${random}${tmp}`;
    cb(null,file_name);
  }
})

const upload = multer({ storage: storage })

app.post('/upload_test',upload.single('image'), (req, res) => {
  res.json({
    code: 200,
    data: null,
    message: 'success'
  })
})

app.post('/upload_cube', upload.single('image'), (req, res) => {
  res.json({
    code: 200,
    data: null,
    message: 'success'
  })
})
module.exports = app