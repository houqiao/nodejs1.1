var express = require('express')
var app = express.Router()
var global = require('../../global')

app.post('login', async(req, res) => {
  const { username, password} = req.body;
  
})


module.exports = app
