import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient(token?: string) {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials are not configured')
    }

    if (token) {
        return createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        })
    }
    return createClient(supabaseUrl, supabaseKey)
}