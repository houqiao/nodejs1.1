var express = require('express')
var app = express.Router()
var supabase = require('../../supabase')

function getCredentials (body) {
  var account = body.email || body.phone || body.mobile || body.username
  var credentials = { password: body.password }
  if (account && account.indexOf('@') !== -1) credentials.email = account
  else if (account) credentials.phone = account
  return credentials
}

function publicUser (user) {
  if (!user) return null
  return { id: user.id, email: user.email, phone: user.phone, createdAt: user.created_at, lastSignInAt: user.last_sign_in_at }
}

function authError (res, error, fallbackMessage) {
  var status = error && error.status >= 400 ? error.status : 400
  return res.status(status).json({ code: status, success: false, message: error && error.message ? error.message : fallbackMessage })
}

function getBearerToken (req) {
  var match = (req.headers.authorization || '').match(/^Bearer\s+(.+)$/i)
  return match ? match[1] : null
}

app.post('/register', async function (req, res) {
  var credentials = getCredentials(req.body || {})
  if ((!credentials.email && !credentials.phone) || !credentials.password) {
    return res.status(400).json({ code: 400, success: false, message: 'Email/phone and password are required' })
  }
  try {
    var result = await supabase.auth.signUp(credentials)
    if (result.error) return authError(res, result.error, 'Registration failed')
    return res.status(201).json({
      code: 201, success: true,
      message: result.data.session ? 'Registration succeeded' : 'Registration succeeded; verification is required',
      data: { user: publicUser(result.data.user), session: result.data.session }
    })
  } catch (error) { return authError(res, error, 'Registration failed') }
})

app.post('/login', async function (req, res) {
  var credentials = getCredentials(req.body || {})
  if ((!credentials.email && !credentials.phone) || !credentials.password) {
    return res.status(400).json({ code: 400, success: false, message: 'Email/phone and password are required' })
  }
  try {
    var result = await supabase.auth.signInWithPassword(credentials)
    if (result.error) return authError(res, result.error, 'Login failed')
    return res.json({
      code: 200, success: true, message: 'Login succeeded',
      data: {
        user: publicUser(result.data.user),
        accessToken: result.data.session.access_token,
        refreshToken: result.data.session.refresh_token,
        expiresAt: result.data.session.expires_at,
        tokenType: result.data.session.token_type
      }
    })
  } catch (error) { return authError(res, error, 'Login failed') }
})

app.get('/user/current', async function (req, res) {
  var token = getBearerToken(req)
  if (!token) return res.status(401).json({ code: 401, success: false, message: 'Missing access token' })
  try {
    var result = await supabase.auth.getUser(token)
    if (result.error) return authError(res, result.error, 'Invalid or expired access token')
    return res.json({ code: 200, success: true, data: publicUser(result.data.user) })
  } catch (error) { return authError(res, error, 'Failed to get current user') }
})

app.post('/logout', async function (req, res) {
  var token = getBearerToken(req)
  if (!token) return res.status(401).json({ code: 401, success: false, message: 'Missing access token' })
  try {
    var result = await supabase.auth.admin.signOut(token, 'local')
    if (result.error) return authError(res, result.error, 'Logout failed')
    return res.json({ code: 200, success: true, message: 'Logout succeeded' })
  } catch (error) { return authError(res, error, 'Logout failed') }
})

module.exports = app
