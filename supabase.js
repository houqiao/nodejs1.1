const { createClient } = require('@supabase/supabase-js')

var supabaseUrl = process.env.SUPABASE_URL
var supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

module.exports = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
})
