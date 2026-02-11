import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials are not configured')
    }
    
    return createClient(supabaseUrl, supabaseKey)
}