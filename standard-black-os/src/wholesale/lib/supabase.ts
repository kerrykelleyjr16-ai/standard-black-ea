import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
// Frontend uses the ANON key only. The service-role key bypasses all database
// security and would be exposed in the public JS bundle if used here. It lives
// only in Supabase Edge Function secrets (server-side). Never add VITE_SUPABASE_SERVICE_KEY.
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)
