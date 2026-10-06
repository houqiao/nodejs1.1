const { fetch, Headers, Request, Response, FormData } = require('undici')

if (!globalThis.fetch) globalThis.fetch = fetch
if (!globalThis.Headers) globalThis.Headers = Headers
if (!globalThis.Request) globalThis.Request = Request
if (!globalThis.Response) globalThis.Response = Response
if (!globalThis.FormData) globalThis.FormData = FormData

const { createClient } = require('@supabase/supabase-js')

var supabaseUrl = process.env.SUPABASE_URL
var supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_API_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or Supabase API key (SUPABASE_SERVICE_ROLE_KEY, SUPABASE_API_KEY, or SUPABASE_ANON_KEY)')
}

module.exports = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
})
