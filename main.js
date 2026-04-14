var txt = require('fs')
var data = txt.readFileSync('demo-阻塞.txt');
console.log(data.toString())
