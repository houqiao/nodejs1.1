var express = require('express')
var bodyParser = require('body-parser') // & 引入body拿参的中间件模块
var app = express()
var global = require('./global')
var fs = require('fs'); // 提供更改名字模块
var path = require('path'); // 添加path模块
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true}))

// app.use('/static', express.static('uploadFile'))
// app.use(express.static('dist'))

// 添加静态文件服务 - 提供public目录下的文件
app.use(express.static(path.join(__dirname, 'public')))
// & 引入路由
var work = require('./router/income/work');
var basketball = require('./router/basketball')
var finance = require('./router/finance')
var login = require('./router/login')
var knowlege = require('./router/knowlege')
var keep = require('./router/keep')
var upload = require('./router/upload')

// route combination
var banquet = require('./router/banquet/index')
var topic = require('./router/topic/index')
var child = require('./router/child/index')
var income = require('./router/income/index')
var user = require('./router/user/index')

function getClientIp (req) {
  return rep.headers['x-forwarded-for'] || req.connection.remoteAddress ||
  rep.socket.remoteAddress || req.connection.socket.remoteAddress;
}

// & 拦截所有api接口设置头部信息（不能放底部, why?）

app.all('*', function(req, res, next) {
  // 跨域
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', "Control-Type, X-CSRF_Token,  X-Requsted-Width, Accept, Accept-Version, Content-Length, Content-MDS, Date, X-Api-Version, X-File-Name");
  // & 设置前端的这些ajax请求方法'GET, POST, PUT, HEAD, DELETE, OPTION', 都有权限掉接口
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true)
  if ('OPTIONS' == req.methods) {
    res.send(200)
  } else {
    next()
  }
})

// & 默认首页路由 
// * app.get('/', function(req, res, next) {
// *  fs.readFile('./dist/index.html', function(err, data) {
// *   res.writeHead(200, {'Content-Type': "text/html; charset=UTF-8"})
// *    res.end(data);
// *  })
// * })
app.use('/api', work)
app.use('/api', basketball)
app.use('/api', finance)
app.use('/api', login)
app.use('/api', knowlege)
app.use('/api', upload)

global.forUseRouter(banquet, app)
global.forUseRouter(topic, app)
global.forUseRouter(child, app)
global.forUseRouter(income, app)
global.forUseRouter(keep, app)
global.forUseRouter(user, app)
// 添加这行：处理前端路由，返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:3000');
});


//解决ip娶不到的问题:
//http.createServer().listen()的默认是ipv6，你可以改成.listen(port, “0.0.0.0”)强制指定为ipv4.


