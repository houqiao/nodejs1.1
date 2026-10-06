var AsyncLocalStorage = require('async_hooks').AsyncLocalStorage
var supabase = require('../supabase')

var requestContext = new AsyncLocalStorage()

function getBearerToken (req) {
  var match = (req.headers.authorization || '').match(/^Bearer\s+(.+)$/i)
  return match ? match[1] : null
}

function isPublicAuthRoute (req) {
  return req.path === '/login' || req.path === '/register' || req.path === '/auth/login'
}

async function authenticate (req, res, next) {
  if (req.method === 'OPTIONS' || isPublicAuthRoute(req)) return next()

  var token = getBearerToken(req)
  if (!token) {
    return res.status(401).json({ code: 401, success: false, message: 'Missing access token' })
  }

  try {
    var result = await supabase.auth.getUser(token)
    if (result.error || !result.data.user) {
      return res.status(401).json({ code: 401, success: false, message: 'Invalid or expired access token' })
    }

    req.user = result.data.user
    requestContext.run({ userId: result.data.user.id, accessToken: token }, next)
  } catch (error) {
    return res.status(401).json({ code: 401, success: false, message: 'Authentication failed' })
  }
}

function getCurrentUserId () {
  var store = requestContext.getStore()
  return store && store.userId
}

module.exports = { authenticate: authenticate, getCurrentUserId: getCurrentUserId }
